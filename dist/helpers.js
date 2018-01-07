"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const globby = require("globby");
const N3 = require("n3");
const rdf = require('rdf');
const semtools = require('semantic-toolkit');
function getFiles(patterns) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = yield globby(patterns, { expandDirectories: true });
        return paths.map(name => fs.readFileSync(name).toString());
    });
}
exports.getFiles = getFiles;
function getOntology(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield getFiles(pattern);
        return files.reduce((memo, data) => {
            return memo + '\n' + data;
        }, '');
    });
}
exports.getOntology = getOntology;
function getPrefixes(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        return (new Promise((resolve, reject) => {
            var prefixes;
            N3.Parser().parse(ontology, (error, triple, p) => {
                if (error)
                    return reject(error);
                prefixes = prefixes ? prefixes : p;
                if (triple === null)
                    return resolve(prefixes);
            });
        })).then(prefixes => {
            if ('' in prefixes) {
                prefixes['$'] = prefixes[''];
                delete prefixes[''];
            }
            return prefixes;
        });
    });
}
exports.getPrefixes = getPrefixes;
function invertObject(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        memo[value] = key;
        return memo;
    }, {});
}
exports.invertObject = invertObject;
function getTriples(ontology) {
    const parser = N3.Parser();
    const triples = parser.parse(ontology, null);
    return triples;
}
exports.getTriples = getTriples;
function getRDFGraph(ontology) {
    const triples = getTriples(ontology);
    return triples.reduce((graph, triple) => {
        const { subject, predicate, object } = triple;
        graph.add(rdf.environment.createTriple(subject, predicate, object));
        return graph;
    }, new rdf.Graph);
}
exports.getRDFGraph = getRDFGraph;
function getGraph(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const triples = getTriples(ontology);
        const prefixes = yield getPrefixes(ontology);
        const prefixMap = invertObject(prefixes);
        const graph = triples.reduce((memo, triple) => {
            const { subject, predicate, object } = triple;
            return [...memo, subject, predicate, object];
        }, []).reduce((memo, maybeIri) => {
            if (!semtools.isIri(maybeIri))
                return memo;
            const prefix = semtools.getNamespace(maybeIri);
            const localName = semtools.getLocalName(maybeIri);
            const prefixLocalName = prefixMap[prefix];
            if (!(prefixLocalName in memo))
                memo[prefixLocalName] = {};
            memo[prefixLocalName][localName] = maybeIri;
            return memo;
        }, {});
        return {
            prefixes,
            graph
        };
    });
}
exports.getGraph = getGraph;
function expandProperty(graph, iri) {
    const range = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#range', null).map(t => t.object);
    const isFunctional = graph.match(iri, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#FunctionalProperty').length === 0;
    return {
        iri,
        range,
        isFunctional
    };
}
exports.expandProperty = expandProperty;
function expandClass(graph, iri) {
    const superClasses = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null).map(t => t.object);
    const properties = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#domain', iri).map(t => t.subject).map(p => expandProperty(graph, p));
    return {
        iri,
        superClasses,
        properties,
    };
}
exports.expandClass = expandClass;
function getClasses(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = getRDFGraph(ontology);
        const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
            .map(t => t.subject);
        const classes = classIris.map(iri => expandClass(graph, iri));
        return classes.map(c => classToTS(c, classIris)).join('\n');
    });
}
exports.getClasses = getClasses;
const nativeTypeMap = {
    boolean: {
        'http://www.w3.org/2001/XMLSchema#boolean': true,
    },
    string: {
        'http://www.w3.org/2001/XMLSchema#string': true,
        'http://www.w3.org/2001/XMLSchema#duration': true,
    },
    number: {
        'http://www.w3.org/2001/XMLSchema#integer': true,
        'http://www.w3.org/2001/XMLSchema#decimal': true,
    },
};
function typeForIris(iris) {
    if (iris.length === 0)
        throw new Error('No type for empty iris.');
    if (iris.length === 1) {
        const [iri] = iris;
        if (iri in nativeTypeMap.boolean)
            return 'boolean';
        if (iri in nativeTypeMap.number)
            return 'number';
        if (iri in nativeTypeMap.string)
            return 'string';
        return semtools.getLocalName(iri);
    }
    const [first, ...rest] = iris;
    return `(${typeForIris([first])} & ${typeForIris(rest)})`;
}
exports.typeForIris = typeForIris;
function propertyToTS(propertyObj) {
    const name = semtools.getLocalName(propertyObj.iri);
    const type = typeForIris(propertyObj.range);
    const plurality = propertyObj.isFunctional ? '[]' : '';
    return `${name}: ${type}${plurality}`;
}
exports.propertyToTS = propertyToTS;
function classToTS(classObj, classIris = []) {
    const name = semtools.getLocalName(classObj.iri);
    const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
    const superTypes = existingSuperClasses.length === 0 ? '' : `${typeForIris(existingSuperClasses)} &`;
    return `
  export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}
exports.classToTS = classToTS;
function graphToTS(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        var str;
        if (typeof value === 'string')
            str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
        else
            str = `\nexport module ${key} { ${graphToTS(value)}}`;
        return memo + str;
    }, ``);
}
exports.graphToTS = graphToTS;
