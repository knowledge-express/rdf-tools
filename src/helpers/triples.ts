import * as N3 from 'n3';

export function getTriples(ontology): Array<N3.Triple> {
  const parser = new N3.Parser();
  const triples: Array<N3.Triple> = <any>parser.parse(ontology, null); // Explicitly pass null as a callback to satisfy the types
  return triples;
}
