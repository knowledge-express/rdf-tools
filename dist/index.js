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
const Helpers = require("./helpers");
const prefixes_1 = require("./prefixes");
const iris_1 = require("./iris");
const classes_1 = require("./classes");
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
    if (!(prefixes || iris || literals || classes))
        return defaultConfig;
    return {
        prefixes,
        iris,
        literals,
        classes,
        defaultExports,
    };
}
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
    (() => __awaiter(this, void 0, void 0, function* () {
        if (program.args.length === 0)
            throw new Error('You must enter a glob pattern.');
        const config = getConfig(program, defaultConfig);
        const glob = program.args;
        const ontology = yield Helpers.getOntology(glob);
        let ts = '', prefixes = { exports: [], prefixes: null }, iris = { exports: [], iris: null }, literals = { exports: [], literals: null }, classes = { exports: [], classes: null };
        if (config.prefixes) {
            prefixes = yield prefixes_1.getPrefixes(ontology);
            ts += Helpers.prefixesToTS(prefixes);
        }
        if (config.iris) {
            iris = yield iris_1.getIRIs(ontology);
            ts += Helpers.IRIsToTS(iris);
        }
        if (config.classes) {
            classes = yield classes_1.getClasses(ontology);
            ts += Helpers.classesToTS(classes);
        }
        if (config.defaultExports) {
            const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
            ts += Helpers.defaultExportsToTS(defaultExports);
        }
        console.log(yield Helpers.formatTS(ts));
    }))().catch(err => {
        console.error(err);
        process.exit(1);
    });
    global["Knowledge"] = module.exports;
}
__export(require("./helpers"));
