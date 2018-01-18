"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const typescript_1 = require("./typescript");
const jsonld_1 = require("./jsonld");
const Package = require('../../package');
function compose(builder, ...otherBuilders) {
    const [otherBuilder, ...rest] = otherBuilders;
    if (rest.length > 0)
        return compose(builder, compose(otherBuilder, ...rest));
    return (...args) => otherBuilder(builder(...args));
}
exports.compose = compose;
exports.build = args => args
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
exports.argv = compose(exports.build, typescript_1.builder, jsonld_1.builder)(yargs).argv;
