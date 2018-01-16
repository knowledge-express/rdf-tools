#!/usr/bin/env node

import * as Model from './model';
import * as Helpers from './helpers';
import * as TS from './typescript';

const Package = require('../package');
//
// declare const require: any;
// if (require.main === module) {
//
//   global["Knowledge"] = module.exports;
// }

export * from './cli';

export * from './helpers';
export * from './model';
export * from './typescript';
