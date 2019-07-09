const semtools = require('semantic-toolkit');

import * as Helpers from '../helpers';

export type Property = {
  iri: string,
  range: string[],
  isFunctional: boolean
  isNative: boolean
}

export type Class = {
  iri: string,
  superClasses: Array<string>,
  subClasses: Array<string>,
  properties: Array<Property>
}

export const nativeTypeMap = {
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

export function isNativeType(iris: string[]): boolean {
  // console.log(`Is native?`, iris);
  return Object.keys(nativeTypeMap).reduce((memo, key) => {
    return memo || iris.reduce((memo, iri) => iri in nativeTypeMap[key], memo);
  }, false);
}

export function expandProperty(graph, iri: string): Object {
  const range = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#range', null).toArray().map(t => t.object.nominalValue);
  const isFunctional = graph.match(iri, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type','http://www.w3.org/2002/07/owl#FunctionalProperty').toArray().length > 0;
  const isNative = isNativeType(range);

  return {
    iri,
    range,
    isFunctional,
    isNative
  };
}

export function expandClass(graph, iri: string): Object {
  const subClasses = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', iri).toArray().map(t => t.subject.nominalValue);
  const superClasses = graph.match(iri, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null).toArray().map(t => t.object.nominalValue)
  const properties = graph.match(null, 'http://www.w3.org/2000/01/rdf-schema#domain', iri).toArray().map(t => t.subject.nominalValue).map(p => expandProperty(graph, p));

  return {
    iri,
    subClasses,
    superClasses,
    properties,
  };
}
export async function getClasses(ontology): Promise<{ exports: string[], classes: Array<Class> }> {
  // const triples = getTriples(ontology);
  const graph = Helpers.getRDFGraph(ontology);
  const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
    .toArray().map(t => t.subject.nominalValue);
    // .map(t => t.subject);

  // console.log(classIris.toArray().map(t => t.subject.nominalValue));

  const classes = classIris.map(iri => expandClass(graph, iri));
  return {
    exports: [],
    classes
  }
}
