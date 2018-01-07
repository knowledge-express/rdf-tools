#!/usr/bin/env node

import * as program from 'commander';

import * as Helpers from './helpers';
import { getPrefixes } from './prefixes';
import { getIRIs } from './iris';
import { getClasses } from './classes';

const Package = require('../package');

const defaultConfig = {
  prefixes: true,
  iris: true,
  literals: true,
  classes: true,
  defaultExports: true,
};

function getConfig(config, defaultConfig) {
  const { prefixes, iris, literals, classes, defaultExports } = config;
  if (!(prefixes || iris || literals || classes)) return defaultConfig;

  return {
    prefixes,
    iris,
    literals,
    classes,
    defaultExports,
  };
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
    .option('-d, --default-exports', 'output default exports. Can only be used in combination with other flags')
    .usage('[options] <pattern>');

  program.parse(process.argv);

  (async () => {
    if (program.args.length === 0) throw new Error('You must enter a glob pattern.');
    const config = getConfig(program, defaultConfig);

    const glob = program.args;
    const ontology = await Helpers.getOntology(glob);

    let ts = '', prefixes = { exports: [], prefixes: null }, iris = { exports: [], iris: null }, literals = { exports: [], literals: null }, classes = { exports: [], classes: null };

    if (config.prefixes) {
      prefixes = await getPrefixes(ontology);
      ts += Helpers.prefixesToTS(prefixes);
    }

    if (config.iris) {
      iris = await getIRIs(ontology);
      ts += Helpers.IRIsToTS(iris);
    }

    // if (config.literals) {
    //   literals = literals || await getLiterals(ontology);
    //   ts += Helpers.literalsToTS(literals);
    // }

    if (config.classes) {
      classes = await getClasses(ontology);
      ts += Helpers.classesToTS(classes);
    }

    if (config.defaultExports) {
      const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
      ts += Helpers.defaultExportsToTS(defaultExports);
    }

    // const ts =  Helpers.classesToTS(classes.classes) + Helpers.IRIsAndLiteralsToTS(IRIsAndLiterals) + `\n\nexport default {\n${Object.keys(IRIsAndLiterals).join(',\n')}\n}`;
    console.log(await Helpers.formatTS(ts));
  })().catch(err => {
    console.error(err);
    // console.error(`ERROR: ${err.message}`);
    // program.help();
    process.exit(1);
  });

  global["Knowledge"] = module.exports;
}

export * from './helpers';
