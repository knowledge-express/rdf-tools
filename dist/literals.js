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
const Helpers = require("./helpers");
function getLiterals(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const triples = Helpers.getTriples(ontology);
        const literals = triples.reduce((memo, triple) => {
            const { subject, predicate, object } = triple;
            return [...memo, subject, predicate, object];
        }, []).reduce((memo, maybeLiteral) => {
            if (semtools.isIri(maybeLiteral))
                return memo;
            memo[maybeLiteral] = maybeLiteral;
            return memo;
        }, {});
        return {
            exports: ['literals'],
            literals
        };
    });
}
exports.getLiterals = getLiterals;
