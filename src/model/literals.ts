const semtools = require('semantic-toolkit');

import * as Helpers from '../helpers';

// TODO: Figure out how to deal with literals
export async function getLiterals(ontology): Promise<{ exports: string[], literals: Object }> {
  const triples = Helpers.getTriples(ontology);

  const literals = triples.reduce((memo, triple) => {
    const { subject, predicate, object } = triple;
    return [ ...memo, subject, predicate, object];
  }, []).reduce((memo, maybeLiteral) => {
    if (semtools.isIri(maybeLiteral)) return memo;

    memo[maybeLiteral] = maybeLiteral;

    return memo;
  }, {});

  return {
    exports: [ 'literals' ],
    literals
  };
}
