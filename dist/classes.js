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
const Helpers = require("./helpers");
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
        const graph = Helpers.getRDFGraph(ontology);
        const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
            .map(t => t.subject);
        const classes = classIris.map(iri => expandClass(graph, iri));
        return classes;
    });
}
exports.getClasses = getClasses;
