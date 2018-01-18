import * as yargs from 'yargs';

import { builder as buildTS } from './typescript';
import { builder as buildLD } from './jsonld';

const Package = require('../../package');

export function compose(builder, ...otherBuilders) {
  const [ otherBuilder, ...rest ] = otherBuilders;
  if (rest.length > 0) return compose(builder, compose(otherBuilder, ...rest));
  return (...args) => otherBuilder(builder(...args));
}

// export function handleError(msg, err, args) {
//   // program.parse(process.argv);
//   console.log(DEBUG);
//
//   if (DEBUG) {
//     console.error(err);
//   }
//   else {
//   // if (err) throw err // preserve stack
//   // console.error(err);
//   console.error(args.help());
//   console.error(`ERROR: ${msg}`);
//   }
//
//   process.exit(1);
// }

export const build = args => args
    .usage('Usage: $0 <command> [options] <pattern>')
    .version(Package.version)
    .alias('v', 'version')
    .boolean('D')
    .alias('D', 'debug')
    .describe('D', 'output debug information')
    .help('h')
    .alias('h', 'help')
    .epilog('Happy coding!')
    .wrap(100);
    // .fail(handleError)

export const argv = compose(build, buildTS, buildLD)(yargs).argv;
