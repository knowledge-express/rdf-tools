#!/usr/bin/env node
import * as yargs from 'yargs';
import { build } from './cli';

declare const require: any;
if (require.main === module) {
  // This actually initializes the CLI. Doing '.argv' is also needed 
  build(yargs).argv;
}

export * from './cli';

export * from './helpers';
export * from './model';
export * from './typescript';
