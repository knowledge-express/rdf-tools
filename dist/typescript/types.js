"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
const _1 = require(".");
function nativeTypesToTS() {
    return Object.keys(_1.nativeTypeMap).map(nativeType => {
        const iris = Object.keys(_1.nativeTypeMap[nativeType]);
        return iris.map(iri => `export type ${_1.typeForIris([iri])} = ${nativeType};`).join('\n');
    }).join('\n');
}
exports.nativeTypesToTS = nativeTypesToTS;
function propertyToTS(propertyObj) {
    const name = semtools.getLocalName(propertyObj.iri);
    const type = _1.typeForIris(propertyObj.range);
    const plurality = propertyObj.isFunctional ? '' : '[]';
    return `${name}: ${type}${plurality}`;
}
exports.propertyToTS = propertyToTS;
function classToTS(classObj, classIris) {
    const name = semtools.getLocalName(classObj.iri);
    const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
    const superTypes = existingSuperClasses.length === 0 ? '' : `${_1.typeForIris(existingSuperClasses)} &`;
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
