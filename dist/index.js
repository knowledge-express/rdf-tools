#!/usr/bin/env node
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const cli_1 = require("./cli");
if (require.main === module) {
    console.log('Running as script.');
    cli_1.build(yargs).argv;
}
__export(require("./cli"));
__export(require("./helpers"));
__export(require("./model"));
__export(require("./typescript"));
