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
const N3 = require("n3");
function getPrefixes(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        return (new Promise((resolve, reject) => {
            var prefixes;
            N3.Parser().parse(ontology, (error, triple, p) => {
                if (error)
                    return reject(error);
                prefixes = prefixes ? prefixes : p;
                if (triple === null)
                    return resolve(prefixes);
            });
        })).then(prefixes => {
            if ('' in prefixes) {
                prefixes['$'] = prefixes[''];
                delete prefixes[''];
            }
            return prefixes;
        });
    });
}
exports.getPrefixes = getPrefixes;
