import * as yargs from 'yargs';

import * as LD from '../jsonld';


export async function handleJSONLD(argv) {
  const pattern = argv.pattern;
  const config = LD.getConfig(argv);

  const output = await LD.handleCommand(pattern, config);
  console.log(output);
}

export const builder = (args: typeof yargs) => args.command([ 'jsonld [options] <pattern>', 'ld' ], 'generate JSON-LD from RDF', (args) => {
  return args
    .option('c', {
      desc: 'output context',
      alias: [ 'context' ],
      boolean: true
    })
}, handleJSONLD).demandCommand();
