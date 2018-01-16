"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
exports.nativeTypeMap = {
    boolean: {},
    string: {
        'http://www.w3.org/2001/XMLSchema#duration': true,
    },
    number: {
        'http://www.w3.org/2001/XMLSchema#integer': true,
        'http://www.w3.org/2001/XMLSchema#decimal': true,
    },
};
function typeForIris(iris) {
    if (iris.length === 0)
        throw new Error('No type for empty iris.');
    if (iris.length === 1) {
        const [iri] = iris;
        return semtools.getLocalName(iri);
    }
    const [first, ...rest] = iris;
    return `(${typeForIris([first])} & ${typeForIris(rest)})`;
}
exports.typeForIris = typeForIris;
function objectToTSModule(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        var str;
        if (typeof value === 'string')
            str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
        else
            str = `\nexport module ${key} { ${objectToTSModule(value)} };`;
        return memo + str;
    }, ``);
}
exports.objectToTSModule = objectToTSModule;
function prefixesToTS({ prefixes }) {
    return objectToTSModule({ prefixes });
}
exports.prefixesToTS = prefixesToTS;
function IRIsToTS({ iris }) {
    return objectToTSModule({ iris });
}
exports.IRIsToTS = IRIsToTS;
function literalsToTS({ literals }) {
    return objectToTSModule({ literals });
}
exports.literalsToTS = literalsToTS;
function defaultExportsToTS(defaultExports) {
    return `export default {\n${defaultExports.join(',\n')}};`;
}
exports.defaultExportsToTS = defaultExportsToTS;
__export(require("./command"));
__export(require("./format"));
__export(require("./type-guards"));
__export(require("./types"));
