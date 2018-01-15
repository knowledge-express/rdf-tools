import test from 'ava';
import * as Model from '../../dist/model';

test('Model - it exists', t => {
  t.not(Model, undefined);
});
