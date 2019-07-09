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
const semtools = require('semantic-toolkit');
const Helpers = require("../helpers");
exports.nativeTypeMap = {
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
function isNativeType(iris) {
    return Object.keys(exports.nativeTypeMap).reduce((memo, key) => {
        return memo || iris.reduce((memo, iri) => iri in exports.nativeTypeMap[key], memo);
    }, false);
}
exports.isNativeType = isNativeType;
function expandProperty(graph, iri) {
    const range = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#range', null).toArray().map(t => t.object.nominalValue);
    const isFunctional = graph.match(iri, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#FunctionalProperty').toArray().length > 0;
    const isNative = isNativeType(range);
    return {
        iri,
        range,
        isFunctional,
        isNative
    };
}
exports.expandProperty = expandProperty;
function expandClass(graph, iri) {
    const subClasses = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', iri).toArray().map(t => t.subject.nominalValue);
    const superClasses = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null).toArray().map(t => t.object.nominalValue);
    const properties = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#domain', iri).toArray().map(t => t.subject.nominalValue).map(p => expandProperty(graph, p));
    return {
        iri,
        subClasses,
        superClasses,
        properties,
    };
}
exports.expandClass = expandClass;
function getClasses(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = Helpers.getRDFGraph(ontology);
        const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
            .toArray().map(t => t.subject.nominalValue);
        const classes = classIris.map(iri => expandClass(graph, iri));
        return {
            exports: [],
            classes
        };
    });
}
exports.getClasses = getClasses;
