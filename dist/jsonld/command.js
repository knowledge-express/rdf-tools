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
const LD = require(".");
function handleCommand(glob, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (glob == null)
            throw new Error('You must enter a glob pattern.');
        const ontology = yield Helpers.getOntology(glob);
        let ld = {};
        if (config.context) {
            const { iris } = yield Model.getIRIs(ontology);
            ld['@context'] = LD.getContext(iris);
        }
        return LD.formatLD(ld);
    });
}
exports.handleCommand = handleCommand;
