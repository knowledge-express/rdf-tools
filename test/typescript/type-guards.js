import test from 'ava';
import * as TypeGuards from '../../dist/typescript/type-guards';

test('TypeGuards - it exists', t => {
  t.not(TypeGuards, undefined);
});
