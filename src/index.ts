#!/usr/bin/env node

import * as program from 'commander';
import * as formatter from 'typescript-formatter';

import { getOntology, getGraph, getClasses, graphToTS, classToTS } from './helpers';
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

  (async () => {
    if (program.args.length === 0) throw new Error('You must enter a glob pattern.');

    const ontology = await getOntology(program.args);
    const graph = await getGraph(ontology);
    const classes = await getClasses(ontology);
    const ts =  (await formatter.processString('', classes + graphToTS(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
    // console.log(classes);
    // const ts =  (await formatter.processString('', graphToTS(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
    console.log(ts);
  })().catch(err => {
    console.error(`ERROR: ${err.message}`);
    program.help();
    process.exit(1);
  });

  global["Knowledge"] = module.exports;
}

export * from './helpers';
