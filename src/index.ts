#!/usr/bin/env node

import * as program from 'commander';
import * as formatter from 'typescript-formatter';

import { getOntology, getGraph, tsify } from './helpers';
const Package = require('../package');

const formatterOptions = {
  replace: false,
  verify: false,
  tsconfig: false,
  tsconfigFile: null,
  tslint: false,
  tslintFile: null,
  editorconfig: false,
  vscode: false,
  vscodeFile: null,
  tsfmt: false,
  tsfmtFile: null
};

declare const require: any;
if (require.main === module) {
  program
    .version(Package.version)
    .usage('[options] <pattern>');

  program.parse(process.argv);

  if (program.args.length === 0) {
    console.error('You must enter a glob pattern.');
    program.help();
    process.exit(1);
  } else {
    (async () => {
      const ontology = await getOntology(program.args);
      const graph = await getGraph(ontology);
      const ts =  (await formatter.processString('', tsify(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
      console.log(ts);
    })();
  }

  global["Knowledge"] = module.exports;
}

export * from './helpers';
