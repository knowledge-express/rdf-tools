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
const fs = require("fs");
const globby = require("globby");
function getFiles(patterns) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = yield globby(patterns, { expandDirectories: true });
        const sorted = paths.sort();
        return paths.map(name => fs.readFileSync(name).toString());
    });
}
exports.getFiles = getFiles;
function getOntology(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield getFiles(pattern);
        return files.reduce((memo, data) => {
            return memo + '\n' + data;
        }, '');
    });
}
exports.getOntology = getOntology;
