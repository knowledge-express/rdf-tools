import test from 'ava';
import * as Ontology from '../../dist/helpers/ontology';

test('Ontology - it exists', t => {
  t.not(Ontology, undefined);
});
