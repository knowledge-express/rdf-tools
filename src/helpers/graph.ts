const rdf = require('rdf');

import { getTriples } from './triples';

export function getRDFGraph(ontology) {
  const triples = getTriples(ontology);
  return triples.reduce((graph, triple) => {
    const { subject, predicate, object } = triple;
    graph.add(rdf.environment.createTriple(subject, predicate, object));
    return graph;
  }, new rdf.Graph);
}
