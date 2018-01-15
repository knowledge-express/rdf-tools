import test from 'ava';
import * as Triples from '../../dist/helpers/triples';

test('Triples - it exists', t => {
  t.not(Triples, undefined);
});
