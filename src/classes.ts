const semtools = require('semantic-toolkit');

import * as Helpers from './helpers';

export type Property = {
  iri: string,
  range: string[],
  isFunctional: boolean
}

export type Class = {
  iri: string,
  superClasses: Array<string>,
  properties: Array<Property>
}


export function expandProperty(graph, iri: string): Object {
  const range = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#range', null).map(t => t.object);
  const isFunctional = graph.match(iri, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type','http://www.w3.org/2002/07/owl#FunctionalProperty').length === 0;
  return {
    iri,
    range,
    isFunctional
  };
}

export function expandClass(graph, iri: string): Object {
  const superClasses = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null).map(t => t.object);
  const properties = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#domain', iri).map(t => t.subject).map(p => expandProperty(graph, p));

  return {
    iri,
    superClasses,
    properties,
  };
}
export async function getClasses(ontology): Promise<Array<Class>> {
  // const triples = getTriples(ontology);
  const graph = Helpers.getRDFGraph(ontology);
  const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
    .map(t => t.subject);

  const classes = classIris.map(iri => expandClass(graph, iri));
  return classes;
}
