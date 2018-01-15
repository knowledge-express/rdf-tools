#!/usr/bin/env node

import * as program from 'commander';

import * as Model from './model';
import * as Helpers from './helpers';
import * as TS from './typescript';

const Package = require('../package');

declare const require: any;
if (require.main === module) {
  program
    .version(Package.version)
    .description(Package.description)
    .option('-p, --prefixes', 'output prefixes')
    .option('-i, --iris', 'output IRIs')
    .option('-l, --literals', 'output literals')
    .option('-c, --classes', 'output classes')
    .option('-t, --type-guards', 'output type guards')
    .option('-d, --default-exports', 'output default exports. Can only be used in combination with other flags')
    .option('-D, --debug', 'output debug information')
    .usage('[options] <pattern>');

  program.parse(process.argv);
  const DEBUG = program.debug || false;

  (async () => {
    if (program.args.length === 0) throw new Error('You must enter a glob pattern.');
    const config = Helpers.getConfig(<Helpers.Config>program);

    const glob = program.args;
    const ontology = await Helpers.getOntology(glob);

    let ts = [],
      prefixes = { exports: [], prefixes: null },
      iris = { exports: [], iris: null },
      literals = { exports: [], literals: null },
      classes = { exports: [], classes: null },
      typeGuards = { exports: [], typeGuards: null };

    if (config.prefixes) {
      prefixes = await Model.getPrefixes(ontology);
      ts.push(TS.prefixesToTS(prefixes));
    }

    if (config.iris) {
      iris = await Model.getIRIs(ontology);
      ts.push(TS.IRIsToTS(iris));
    }

    // TODO: This is disabled until we figure out how to expose literals in TS
    // if (config.literals) {
    //   literals = await Model.getLiterals(ontology);
    //   ts.push(TS.literalsToTS(literals));
    // }

    if (config.classes) {
      classes = await Model.getClasses(ontology);
      ts.push(TS.classesToTS(classes));
    }

    if (config.typeGuards) {
      typeGuards = await Model.getTypeGuards(ontology);
      ts.push(TS.typeGuardsToTS(typeGuards));
    }

    if (config.defaultExports) {
      const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
      ts.push(TS.defaultExportsToTS(defaultExports));
    }

    console.log(await TS.formatTS(ts.join('\n')));
  })().catch(err => {
    if (DEBUG) console.error(err);
    else {
      console.error(`ERROR: ${err.message}`);
      program.help();
    }

    process.exit(1);
  });

  global["Knowledge"] = module.exports;
}

export * from './helpers';
export * from './model';
export * from './typescript';
