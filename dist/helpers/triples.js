"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const N3 = require("n3");
function getTriples(ontology) {
    const parser = N3.Parser();
    const triples = parser.parse(ontology, null);
    return triples;
}
exports.getTriples = getTriples;
