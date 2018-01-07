"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
function invertObject(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        memo[value] = key;
        return memo;
    }, {});
}
exports.invertObject = invertObject;
__export(require("./graph"));
__export(require("./ontology"));
__export(require("./triples"));
__export(require("./typescript"));
