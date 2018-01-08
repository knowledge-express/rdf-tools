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
const formatter = require("typescript-formatter");
const nativeTypeMap = {
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
function nativeTypesToTS() {
    return Object.keys(nativeTypeMap).map(nativeType => {
        const iris = Object.keys(nativeTypeMap[nativeType]);
        return iris.map(iri => `export type ${typeForIris([iri])} = ${nativeType};`).join('\n');
    }).join('\n');
}
exports.nativeTypesToTS = nativeTypesToTS;
function propertyToTS(propertyObj) {
    const name = semtools.getLocalName(propertyObj.iri);
    const type = typeForIris(propertyObj.range);
    const plurality = propertyObj.isFunctional ? '[]' : '';
    return `${name}: ${type}${plurality}`;
}
exports.propertyToTS = propertyToTS;
function classToTS(classObj, classIris = []) {
    const name = semtools.getLocalName(classObj.iri);
    const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
    const superTypes = existingSuperClasses.length === 0 ? '' : `${typeForIris(existingSuperClasses)} &`;
    return `export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}
exports.classToTS = classToTS;
function classesToTS(classesObj) {
    const nativeTypeTS = nativeTypesToTS();
    const iris = classesObj.classes.map(c => c.iri);
    return nativeTypeTS + '\n' + classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}
exports.classesToTS = classesToTS;
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
exports.formatterOptions = {
    replace: false,
    verify: false,
    tsconfig: false,
    tsconfigFile: null,
    tslint: false,
    tslintFile: null,
    editorconfig: false,
    vscode: false,
    vscodeFile: null,
    tsfmt: false,
    tsfmtFile: null
};
function formatTS(ts, options = exports.formatterOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield formatter.processString('', ts, exports.formatterOptions)).dest;
    });
}
exports.formatTS = formatTS;
