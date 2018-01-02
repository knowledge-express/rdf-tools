#!/usr/bin/env node

import * as program from 'commander';

import { getOntology, getGraph } from './helpers';
const Package = require('../package');

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
    console.log(graph);
  })();
}
