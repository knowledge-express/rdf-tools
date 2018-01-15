#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const Model = require("./model");
const Helpers = require("./helpers");
const TS = require("./typescript");
const Package = require('../package');
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
    (() => __awaiter(this, void 0, void 0, function* () {
        if (program.args.length === 0)
            throw new Error('You must enter a glob pattern.');
        const config = Helpers.getConfig(program);
        const glob = program.args;
        const ontology = yield Helpers.getOntology(glob);
        let ts = [], prefixes = { exports: [], prefixes: null }, iris = { exports: [], iris: null }, literals = { exports: [], literals: null }, classes = { exports: [], classes: null }, typeGuards = { exports: [], typeGuards: null };
        if (config.prefixes) {
            prefixes = yield Model.getPrefixes(ontology);
            ts.push(TS.prefixesToTS(prefixes));
        }
        if (config.iris) {
            iris = yield Model.getIRIs(ontology);
            ts.push(TS.IRIsToTS(iris));
        }
        if (config.classes) {
            classes = yield Model.getClasses(ontology);
            ts.push(TS.classesToTS(classes));
        }
        if (config.typeGuards) {
            typeGuards = yield Model.getTypeGuards(ontology);
            ts.push(TS.typeGuardsToTS(typeGuards));
        }
        if (config.defaultExports) {
            const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
            ts.push(TS.defaultExportsToTS(defaultExports));
        }
        console.log(yield TS.formatTS(ts.join('\n')));
    }))().catch(err => {
        if (DEBUG)
            console.error(err);
        else {
            console.error(`ERROR: ${err.message}`);
            program.help();
        }
        process.exit(1);
    });
    global["Knowledge"] = module.exports;
}
__export(require("./helpers"));
__export(require("./model"));
__export(require("./typescript"));
