import test from 'ava';
import * as TypeGuards from '../../dist/model/type-guards';

test('TypeGuards - it exists', t => {
  t.not(TypeGuards, undefined);
});
