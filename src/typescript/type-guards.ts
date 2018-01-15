const semtools = require('semantic-toolkit');
import { typeForIris, nativeTypeMap } from '.';

import { Property, Class } from '../model';

export function nativeTypesToTypeGuardTS() {
  return Object.keys(nativeTypeMap).map(nativeType => {
    const iris = Object.keys(nativeTypeMap[nativeType]);
    return iris.map(iri => {
      const typeName = typeForIris([ iri ]);
      const typeGuardName = getTypeGuardName(typeName);

      return `export function ${typeGuardName}(obj: any): obj is ${typeName} {
        return typeof obj === "${nativeType}";
      }`;
    }).join('\n');
  }).join('\n');
}

export function getTypeGuardName(typeName: string) {
  return `is${typeName[0].toUpperCase() + typeName.slice(1, typeName.length)}`;
}

export type TypeGuardOptions = {
  allowUndefinedProperties?: boolean,
  allowNullProperties?: boolean,
  typeCheckEnabled?: boolean,
  propertyTypeCheckEnabled?: boolean,
  inheritance?: boolean,
  completeness?: boolean
};

export const defaultTypeGuardOptions: TypeGuardOptions = {
  allowUndefinedProperties: true,
  allowNullProperties: true,
  typeCheckEnabled: true,
  propertyTypeCheckEnabled: false,
  inheritance: true,
  completeness: false
};

function propertyToPredicate(propertyObj: Property, options: TypeGuardOptions): string {
  const name = semtools.getLocalName(propertyObj.iri);
  const type = typeForIris(propertyObj.range);

  const isSingular = propertyObj.isFunctional;
  const isNativetype = type in nativeTypeMap;

  const keyCheck = `"${name}" in obj`;
  const undefinedCheck = `obj["${name}"] !== undefined`;
  const nullCheck = `obj["${name}"] !== null`;
  const typeCheck = isNativetype ?
    (isSingular ? `typeof obj["${name}"] === "${type}"` :`obj["${name}"] instanceof Array && obj["${name}"].reduce((memo, value) => typeof value === "${type}", true)`) :
    (isSingular ? `${getTypeGuardName(type)}(obj["${name}"])` : `obj["${name}"] instanceof Array && obj["${name}"].reduce((memo, value) => ${getTypeGuardName(type)}(value), true)`);

  const checks = [ keyCheck ];
  if (!options.allowUndefinedProperties) checks.push(undefinedCheck);
  if (!options.allowNullProperties) checks.push(nullCheck);
  if (options.propertyTypeCheckEnabled) checks.push(typeCheck);

  return `(${checks.join(' && ')})`;
}

function superClassToPredicate(superClassIRI: string, options: TypeGuardOptions) {
  const name = semtools.getLocalName(superClassIRI);
  return `${getTypeGuardName(name)}(obj)`;
}

export function classToTypeGuardTS(classObj: Class, classIris: string[], options: TypeGuardOptions = {}): string {
  const typeGuardOptions = { ...defaultTypeGuardOptions, ...options };
  const typeName = semtools.getLocalName(classObj.iri);
  const typeGuardName = getTypeGuardName(typeName);

  const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
  const existingSubClasses = classObj.subClasses.filter(c => classIris.indexOf(c) != -1);

  const objExists = `obj != null`;
  const objHasTypes = `"type" in obj && obj.type instanceof Array`;
  const typeCheck = [].concat(typeName, existingSubClasses.map(semtools.getLocalName)).map(type => `"${type}" in types`).join(' || ');
  const inheritance = typeGuardOptions.inheritance ? existingSuperClasses.map(superClass => superClassToPredicate(superClass, typeGuardOptions)) : [];
  const completeness = typeGuardOptions.completeness ? classObj.properties.map(property => propertyToPredicate(property, typeGuardOptions)) : [];

  const predicates = [].concat(
    objExists,
    objHasTypes,
    typeCheck,
    inheritance,
    completeness
  );

  return `export function ${typeGuardName}(obj: any): obj is ${typeName} {
    const types = (obj.type || []).reduce((memo, type) => { memo[type] = true; return memo; }, {});
    return ${predicates.map(predicate => `(${predicate})`).join(' &&\n')};
  }`;
}

export function typeGuardsToTS(typeGuardsObj: { typeGuards: Class[] }): string {
  const nativeTypesTypeGuardTS = nativeTypesToTypeGuardTS();
  const iris = typeGuardsObj.typeGuards.map(c => c.iri);
  return nativeTypesTypeGuardTS + '\n' + typeGuardsObj.typeGuards.map(c => classToTypeGuardTS(c, iris)).join('\n');
}
