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
const TS = require("../typescript");
function handleTypescript(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const pattern = argv.pattern;
        const config = TS.getConfig(argv);
        const output = yield TS.handleCommand(pattern, config);
        console.log(output);
    });
}
exports.handleTypescript = handleTypescript;
exports.builder = args => args.command(['typescript [options] <pattern>', 'ts'], 'generate TypeScript from RDF', (args) => {
    return args
        .option('p', {
        desc: 'output prefixes',
        alias: ['prefixes'],
        boolean: true
    })
        .option('i', {
        desc: 'output iris',
        alias: ['iris'],
        boolean: true
    })
        .option('c', {
        desc: 'output classes',
        alias: ['classes'],
        boolean: true
    })
        .option('t', {
        desc: 'output type guards',
        alias: ['type-guards'],
        boolean: true
    })
        .option('d', {
        desc: 'output default exports',
        alias: ['default-exports'],
        boolean: true
    });
}, handleTypescript).demandCommand();
