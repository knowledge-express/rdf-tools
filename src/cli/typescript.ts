import * as yargs from 'yargs';

import * as TS from '../typescript';

export async function handleTypescript(argv) {
  const pattern = argv.pattern;
  const config = TS.getConfig(argv);
  // console.log(pattern, config);

  const output = await TS.handleCommand(pattern, config);
  console.log(output);
}

export const builder = (args: typeof yargs) => args.command([ 'typescript [options] <pattern>', 'ts' ], 'generate TypeScript from RDF', (args) => {
  return args
    .option('p', {
      desc: 'output prefixes',
      alias: [ 'prefixes' ],
      boolean: true
    })
    .option('i', {
      desc: 'output iris',
      alias: [ 'iris' ],
      boolean: true
    })
    .option('c', {
      desc: 'output classes',
      alias: [ 'classes' ],
      boolean: true
    })
    .option('t', {
      desc: 'output type guards',
      alias: [ 'type-guards' ],
      boolean: true
    })
    .option('d', {
      desc: 'output default exports',
      alias: [ 'default-exports' ],
      boolean: true
    })
}, handleTypescript).demandCommand();
