#!/usr/bin/env node

import * as program from 'commander';
import * as formatter from 'typescript-formatter';

import * as Helpers from './helpers';
import { getPrefixes } from './prefixes';
import { getIRIsAndLiterals } from './iris-and-literals';
import { getClasses } from './classes';
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

    const ontology = await Helpers.getOntology(program.args);
    const graph = await getIRIsAndLiterals(ontology);
    const classes = await getClasses(ontology);
    const ts =  (await formatter.processString('', Helpers.classesToTS(classes) + Helpers.IRIsAndLiteralsToTS(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
    // console.log(classes);
    // const ts =  (await formatter.processString('', IRIsAndLiteralsToTS(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
    console.log(ts);
  })().catch(err => {
    console.error(`ERROR: ${err.message}`);
    program.help();
    process.exit(1);
  });

  global["Knowledge"] = module.exports;
}

export * from './helpers';
