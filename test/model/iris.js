import test from 'ava';
import * as IRIs from '../../dist/model/iris';

test('IRIs - it exists', t => {
  t.not(IRIs, undefined);
});
