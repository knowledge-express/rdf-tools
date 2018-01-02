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
const semtools = require('semantic-toolkit');
function getFiles(patterns) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('globbing pattern', patterns);
        const paths = yield globby(patterns, { expandDirectories: true });
        console.log('Got paths:', paths);
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
function getGraph(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = N3.Parser();
        const triples = parser.parse(ontology, null);
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
function tsify(graph) {
    return JSON.stringify(graph);
}
exports.tsify = tsify;
