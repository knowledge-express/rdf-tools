const semtools = require('semantic-toolkit');

import { getPrefixes } from './prefixes';
import * as Helpers from './helpers';

// TODO: Literals
export async function getIRIs(ontology): Promise<{ exports: string[], iris: Object }> {
  const triples = Helpers.getTriples(ontology);
  const { prefixes } = await getPrefixes(ontology);
  const prefixMap = Helpers.invertObject(prefixes);

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
    exports: [ 'iris' ],
    iris: graph
  };
}
