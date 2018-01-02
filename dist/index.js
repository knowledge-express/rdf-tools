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
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const helpers_1 = require("./helpers");
const Package = require('../package');
program
    .version(Package.version)
    .usage('[options] <pattern>');
program.parse(process.argv);
if (program.args.length === 0) {
    console.error('You must enter a glob pattern.');
    program.help();
    process.exit(1);
}
else {
    (() => __awaiter(this, void 0, void 0, function* () {
        const ontology = yield helpers_1.getOntology(program.args);
        const graph = yield helpers_1.getGraph(ontology);
        console.log(graph);
    }))();
}
