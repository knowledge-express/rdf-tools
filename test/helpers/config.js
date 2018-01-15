import test from 'ava';
import * as Config from '../../dist/helpers/config';

test('Config - it exists', t => {
  t.not(Config, undefined);
});
