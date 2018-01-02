// import * as path from 'path';
import * as fs from 'fs';
import * as globby from 'globby';
import * as N3 from 'n3';
const semtools = require('semantic-toolkit');

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

export async function getGraph(ontology): Promise<Object> {
  const parser = N3.Parser();
  const triples: Array<N3.Triple> = <any>parser.parse(ontology, null); // Explicitly pass null as a callback to satisfy the types
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

export function tsify(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
    else str = `\nexport module ${key} { ${tsify(value)}}`;

    return memo + str;
  }, ``);
  // return JSON.stringify(graph);
}
