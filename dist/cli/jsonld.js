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
const LD = require("../jsonld");
function handleJSONLD(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const pattern = argv.pattern;
        const config = LD.getConfig(argv);
        const output = yield LD.handleCommand(pattern, config);
        console.log(output);
    });
}
exports.handleJSONLD = handleJSONLD;
exports.builder = args => args.command(['jsonld [options] <pattern>', 'ld'], 'generate JSON-LD from RDF', (args) => {
    return args
        .option('c', {
        desc: 'output context',
        alias: ['context'],
        boolean: true
    });
}, handleJSONLD).demandCommand();
