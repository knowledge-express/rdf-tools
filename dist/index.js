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
const formatter = require("typescript-formatter");
const Helpers = require("./helpers");
const iris_and_literals_1 = require("./iris-and-literals");
const classes_1 = require("./classes");
const Package = require('../package');
const formatterOptions = {
    replace: false,
    verify: false,
    tsconfig: false,
    tsconfigFile: null,
    tslint: false,
    tslintFile: null,
    editorconfig: false,
    vscode: false,
    vscodeFile: null,
    tsfmt: false,
    tsfmtFile: null
};
if (require.main === module) {
    program
        .version(Package.version)
        .usage('[options] <pattern>');
    program.parse(process.argv);
    (() => __awaiter(this, void 0, void 0, function* () {
        if (program.args.length === 0)
            throw new Error('You must enter a glob pattern.');
        const ontology = yield Helpers.getOntology(program.args);
        const graph = yield iris_and_literals_1.getIRIsAndLiterals(ontology);
        const classes = yield classes_1.getClasses(ontology);
        const ts = (yield formatter.processString('', Helpers.classesToTS(classes) + Helpers.IRIsAndLiteralsToTS(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
        console.log(ts);
    }))().catch(err => {
        console.error(`ERROR: ${err.message}`);
        program.help();
        process.exit(1);
    });
    global["Knowledge"] = module.exports;
}
__export(require("./helpers"));
