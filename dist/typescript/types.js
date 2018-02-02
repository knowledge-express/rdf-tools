"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
const _1 = require(".");
const model_1 = require("../model");
function nativeTypesToTS() {
    return Object.keys(model_1.nativeTypeMap).map(nativeType => {
        const iris = Object.keys(model_1.nativeTypeMap[nativeType]);
        return iris.map(iri => {
            const aliasType = _1.typeForIris([iri]);
            if (nativeType === aliasType)
                return '';
            return `export type ${aliasType} = ${nativeType};`;
        }).join('\n');
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
    const superTypes = existingSuperClasses.length === 0 ? 'RDF.Resource &' : `${_1.typeForIris(existingSuperClasses)} &`;
    return `export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}
exports.classToTS = classToTS;
function rdfResourceToTS() {
    return `export module RDF {
    export type Resource = {
      id: string
    };
  };`;
}
exports.rdfResourceToTS = rdfResourceToTS;
function classToTSAliases(classObj, classIris) {
    const name = semtools.getLocalName(classObj.iri);
    const propertyRanges = classObj.properties.reduce((memo, property) => [...memo, ...(property.isNative ? [] : property.range)], []);
    const nonExistingPropertyClasses = propertyRanges.filter(c => classIris.indexOf(c) == -1);
    const nonExistingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) == -1);
    const nonExistingClasses = Object.keys([...nonExistingPropertyClasses, ...nonExistingSuperClasses].reduce((memo, key) => (Object.assign({}, memo, { [key]: true })), {}));
    return nonExistingClasses;
}
exports.classToTSAliases = classToTSAliases;
function aliasRDFResources(classesObj) {
    const iris = classesObj.classes.map(c => c.iri);
    const rdfTS = rdfResourceToTS();
    const nonExistingClasses = Object.keys(classesObj.classes.reduce((memo, c) => [...memo, ...classToTSAliases(c, iris)], []).reduce((memo, key) => (Object.assign({}, memo, { [key]: true })), {}));
    const aliasesTS = nonExistingClasses.map(iri => {
        const aliasType = _1.typeForIris([iri]);
        return `export type ${aliasType} = RDF.Resource;`;
    }).join('\n');
    return rdfTS + '\n' + aliasesTS;
}
exports.aliasRDFResources = aliasRDFResources;
function classesToTS(classesObj) {
    const nativeTypeTS = nativeTypesToTS();
    const aliasesTS = aliasRDFResources(classesObj);
    const iris = classesObj.classes.map(c => c.iri);
    return nativeTypeTS + '\n' + aliasesTS + '\n' + classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}
exports.classesToTS = classesToTS;
