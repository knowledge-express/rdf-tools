// import * as path from 'path';
import * as fs from 'fs';
import * as globby from 'globby';
import * as N3 from 'n3';
const rdf = require('rdf');
const semtools = require('semantic-toolkit');

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

export async function getFiles(patterns: Array<string>): Promise<Array<string>> {
  // console.log('globbing pattern', patterns);
  const paths = await globby(patterns, <any>{ expandDirectories: true })
  // console.log('Got paths:', paths);
  return paths.map(name => fs.readFileSync(name).toString());
}

export async function getOntology(pattern) {
  const files = await getFiles(pattern);
  return files.reduce((memo, data) => {
    return memo + '\n' + data;
  }, '');
}

export async function getPrefixes(ontology): Promise<{ [index: string]: string }> {
  // Do some inefficient things to get the prefixes
  return (new Promise<{ [index: string]: string }>((resolve, reject) => {
    var prefixes;
    N3.Parser().parse(ontology, (error, triple, p) => {
      if (error) return reject(error);

      // console.log(p);
      prefixes = prefixes ? prefixes : p;

      if (triple === null) return resolve(prefixes);
    });
  })).then(prefixes => {
    if ('' in prefixes) {
      prefixes['$'] = prefixes[''];
      delete prefixes[''];
    }

    return prefixes;
  });
}

export function invertObject(obj: { [index: string]: string }): { [index: string]: string } {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    memo[value] = key;
    return memo;
  }, {});
}

export function getTriples(ontology): Array<N3.Triple> {
  const parser = N3.Parser();
  const triples: Array<N3.Triple> = <any>parser.parse(ontology, null); // Explicitly pass null as a callback to satisfy the types
  return triples;
}

export function getRDFGraph(ontology) {
  const triples = getTriples(ontology);
  return triples.reduce((graph, triple) => {
    const { subject, predicate, object } = triple;
    graph.add(rdf.environment.createTriple(subject, predicate, object));
    return graph;
  }, new rdf.Graph);
}

// TODO: Literals
export async function getGraph(ontology): Promise<Object> {
  const triples = getTriples(ontology);
  const prefixes = await getPrefixes(ontology);
  const prefixMap = invertObject(prefixes);

  const graph = triples.reduce((memo, triple) => {
    const { subject, predicate, object } = triple;
    return [ ...memo, subject, predicate, object];
  }, []).reduce((memo, maybeIri) => {
    if (!semtools.isIri(maybeIri)) return memo;

    const prefix = semtools.getNamespace(maybeIri);
    const localName = semtools.getLocalName(maybeIri);
    const prefixLocalName = prefixMap[prefix];
    // console.log('Prefix and localname:', prefix, localName);

    if (!(prefixLocalName in memo)) memo[prefixLocalName] = {};
    memo[prefixLocalName][localName] = maybeIri;

    return memo;
  }, {});

  return {
    prefixes,
    graph
  }
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
  const graph = getRDFGraph(ontology);
  const classIris = graph.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class')
    .map(t => t.subject);

  const classes = classIris.map(iri => expandClass(graph, iri));
  // const classes = triples.reduce((memo, triple) => {
  //   const { subject, predicate, object } = triple;
  //   if (subject in memo) memo[subject][predicate]
  //   return memo;
  // }, {})

  return classes.map(c => classToTS(c, classIris)).join('\n');
}

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
}

export function typeForIris(iris: string[]): string {
  if (iris.length === 0) throw new Error('No type for empty iris.');
  if (iris.length === 1) {
    // TODO: Map literal types to native JS types
    const [ iri ] = iris;
    if (iri in nativeTypeMap.boolean) return 'boolean';
    if (iri in nativeTypeMap.number)  return 'number';
    if (iri in nativeTypeMap.string)  return 'string';
    return semtools.getLocalName(iri);
  }

  const [ first, ...rest ] = iris;
  return `(${typeForIris([ first ])} & ${typeForIris(rest)})`;
  // throw new Error('Union types not implemented yet.');
}

export function propertyToTS(propertyObj: Property): string {
  const name = semtools.getLocalName(propertyObj.iri);
  const type = typeForIris(propertyObj.range);
  const plurality = propertyObj.isFunctional ? '[]' : '';

  return `${name}: ${type}${plurality}`;
}

export function classToTS(classObj: Class, classIris: string[] = []): string {
  const name = semtools.getLocalName(classObj.iri);
  const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
  const superTypes = existingSuperClasses.length === 0 ? '' : `${typeForIris(existingSuperClasses)} &`;

  return `
  export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}

export function graphToTS(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
    else str = `\nexport module ${key} { ${graphToTS(value)}}`;

    return memo + str;
  }, ``);
  // return JSON.stringify(graph);
}
