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
const Model = require("../model");
const Helpers = require("../helpers");
const TS = require(".");
function handleCommand(glob, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (glob == null)
            throw new Error('You must enter a glob pattern.');
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
        return yield TS.formatTS(ts.join('\n'));
    });
}
exports.handleCommand = handleCommand;
