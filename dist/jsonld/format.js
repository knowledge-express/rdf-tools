"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFormat = require("json-format");
exports.formatterOptions = {
    type: 'space',
    size: 2
};
function formatLD(ld, options = exports.formatterOptions) {
    return jsonFormat(ld, options);
}
exports.formatLD = formatLD;
