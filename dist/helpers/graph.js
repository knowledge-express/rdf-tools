"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rdf = require('rdf');
const triples_1 = require("./triples");
function getRDFGraph(ontology) {
    const triples = triples_1.getTriples(ontology);
    return triples.reduce((graph, triple) => {
        const { subject, predicate, object } = triple;
        graph.add(rdf.environment.createTriple(subject.id, predicate.id, object.id));
        return graph;
    }, new rdf.Graph);
}
exports.getRDFGraph = getRDFGraph;
