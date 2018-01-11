#!/usr/bin/env node

import * as program from 'commander';

import * as Helpers from './helpers';
import { getPrefixes } from './prefixes';
import { getIRIs } from './iris';
import { getLiterals } from './literals';
import { getClasses } from './classes';
import { getTypeGuards } from './type-guards';

const Package = require('../package');

const defaultConfig = {
  prefixes: true,
  iris: true,
  literals: true,
  classes: true,
  typeGuards: true,
  defaultExports: true,
};

function getConfig(config) {
  if (Object.keys(defaultConfig).reduce((memo, key) => (memo && !(key in config)), true)) return defaultConfig;
  return config;
}

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
    const config = getConfig(program);

    const glob = program.args;
    const ontology = await Helpers.getOntology(glob);

    let ts = [],
      prefixes = { exports: [], prefixes: null },
      iris = { exports: [], iris: null },
      literals = { exports: [], literals: null },
      classes = { exports: [], classes: null },
      typeGuards = { exports: [], typeGuards: null };

    if (config.prefixes) {
      prefixes = await getPrefixes(ontology);
      ts.push(Helpers.prefixesToTS(prefixes));
    }

    if (config.iris) {
      iris = await getIRIs(ontology);
      ts.push(Helpers.IRIsToTS(iris));
    }

    // TODO: This is disabled until we figure out how to expose literals in TS
    // if (config.literals) {
    //   literals = await getLiterals(ontology);
    //   ts.push(Helpers.literalsToTS(literals));
    // }

    if (config.classes) {
      classes = await getClasses(ontology);
      ts.push(Helpers.classesToTS(classes));
    }

    if (config.typeGuards) {
      typeGuards = await getTypeGuards(ontology);
      ts.push(Helpers.typeGuardsToTS(typeGuards));
    }

    if (config.defaultExports) {
      const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
      ts.push(Helpers.defaultExportsToTS(defaultExports));
    }

    console.log(await Helpers.formatTS(ts.join('\n')));
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
