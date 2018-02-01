"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
const _1 = require(".");
const model_1 = require("../model");
function nativeTypesToTypeGuardTS() {
    return Object.keys(model_1.nativeTypeMap).map(nativeType => {
        const iris = Object.keys(model_1.nativeTypeMap[nativeType]);
        return iris.map(iri => {
            const typeName = _1.typeForIris([iri]);
            const typeGuardName = getTypeGuardName(typeName);
            return `export function ${typeGuardName}(obj: any): obj is ${typeName} {
        return typeof obj === "${nativeType}";
      }`;
        }).join('\n');
    }).join('\n');
}
exports.nativeTypesToTypeGuardTS = nativeTypesToTypeGuardTS;
function getTypeGuardName(typeName) {
    return `is${typeName[0].toUpperCase() + typeName.slice(1, typeName.length)}`;
}
exports.getTypeGuardName = getTypeGuardName;
exports.defaultTypeGuardOptions = {
    allowUndefinedProperties: true,
    allowNullProperties: true,
    typeCheckEnabled: true,
    propertyTypeCheckEnabled: false,
    inheritance: true,
    completeness: false
};
function propertyToPredicate(propertyObj, options) {
    const name = semtools.getLocalName(propertyObj.iri);
    const type = _1.typeForIris(propertyObj.range);
    const isSingular = propertyObj.isFunctional;
    const isNativetype = type in model_1.nativeTypeMap;
    const keyCheck = `"${name}" in obj`;
    const undefinedCheck = `obj["${name}"] !== undefined`;
    const nullCheck = `obj["${name}"] !== null`;
    const typeCheck = isNativetype ?
        (isSingular ? `typeof obj["${name}"] === "${type}"` : `obj["${name}"] instanceof Array && obj["${name}"].reduce((memo, value) => typeof value === "${type}", true)`) :
        (isSingular ? `${getTypeGuardName(type)}(obj["${name}"])` : `obj["${name}"] instanceof Array && obj["${name}"].reduce((memo, value) => ${getTypeGuardName(type)}(value), true)`);
    const checks = [keyCheck];
    if (!options.allowUndefinedProperties)
        checks.push(undefinedCheck);
    if (!options.allowNullProperties)
        checks.push(nullCheck);
    if (options.propertyTypeCheckEnabled)
        checks.push(typeCheck);
    return `(${checks.join(' && ')})`;
}
function superClassToPredicate(superClassIRI, options) {
    const name = semtools.getLocalName(superClassIRI);
    return `${getTypeGuardName(name)}(obj)`;
}
function classToTypeGuardTS(classObj, classIris, options = {}) {
    const typeGuardOptions = Object.assign({}, exports.defaultTypeGuardOptions, options);
    const typeName = semtools.getLocalName(classObj.iri);
    const typeGuardName = getTypeGuardName(typeName);
    const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
    const existingSubClasses = classObj.subClasses.filter(c => classIris.indexOf(c) != -1);
    const objExists = `obj != null`;
    const objHasTypes = `"type" in obj && obj.type instanceof Array`;
    const typeCheck = [].concat(typeName, existingSubClasses.map(semtools.getLocalName)).map(type => `"${type}" in types`).join(' || ');
    const inheritance = typeGuardOptions.inheritance ? existingSuperClasses.map(superClass => superClassToPredicate(superClass, typeGuardOptions)) : [];
    const completeness = typeGuardOptions.completeness ? classObj.properties.map(property => propertyToPredicate(property, typeGuardOptions)) : [];
    const predicates = [].concat(objExists, objHasTypes, typeCheck, inheritance, completeness);
    return `export function ${typeGuardName}(obj: any): obj is ${typeName} {
    const types = (obj.type || []).reduce((memo, type) => { memo[type] = true; return memo; }, {});
    return ${predicates.map(predicate => `(${predicate})`).join(' &&\n')};
  }`;
}
exports.classToTypeGuardTS = classToTypeGuardTS;
function typeGuardsToTS(typeGuardsObj) {
    const nativeTypesTypeGuardTS = nativeTypesToTypeGuardTS();
    const iris = typeGuardsObj.typeGuards.map(c => c.iri);
    return nativeTypesTypeGuardTS + '\n' + typeGuardsObj.typeGuards.map(c => classToTypeGuardTS(c, iris)).join('\n');
}
exports.typeGuardsToTS = typeGuardsToTS;
