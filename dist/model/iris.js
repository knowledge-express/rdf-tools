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
const semtools = require('semantic-toolkit');
const prefixes_1 = require("./prefixes");
const Helpers = require("../helpers");
function getIRIs(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const triples = Helpers.getTriples(ontology);
        const { prefixes } = yield prefixes_1.getPrefixes(ontology);
        const prefixMap = Helpers.invertObject(prefixes);
        const iris = triples.reduce((memo, triple) => {
            const { subject, predicate, object } = triple;
            return [...memo, subject, predicate, object];
        }, []).reduce((memo, maybeIri) => {
            if (!semtools.isIri(maybeIri))
                return memo;
            const prefix = semtools.getNamespace(maybeIri);
            const localName = semtools.getLocalName(maybeIri);
            const prefixLocalName = prefixMap[prefix];
            if (!(prefixLocalName in memo))
                memo[prefixLocalName] = {};
            memo[prefixLocalName][localName] = maybeIri;
            return memo;
        }, {});
        return {
            exports: ['iris'],
            iris: iris
        };
    });
}
exports.getIRIs = getIRIs;
