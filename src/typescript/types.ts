const semtools = require('semantic-toolkit');
import { typeForIris, nativeTypeMap } from '.';

import { Property, Class } from '../model';

export function nativeTypesToTS() {
  return Object.keys(nativeTypeMap).map(nativeType => {
    const iris = Object.keys(nativeTypeMap[nativeType]);
    return iris.map(iri => `export type ${typeForIris([ iri ])} = ${nativeType};`).join('\n')
  }).join('\n');
}

export function propertyToTS(propertyObj: Property): string {
  const name = semtools.getLocalName(propertyObj.iri);
  const type = typeForIris(propertyObj.range);
  const plurality = propertyObj.isFunctional ? '' : '[]';

  return `${name}: ${type}${plurality}`;
}

export function classToTS(classObj: Class, classIris: string[]): string {
  const name = semtools.getLocalName(classObj.iri);
  const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
  const superTypes = existingSuperClasses.length === 0 ? '' : `${typeForIris(existingSuperClasses)} &`;

  return `export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}

export function classesToTS(classesObj: { classes: Class[] }): string {
  const nativeTypeTS = nativeTypesToTS();
  const iris = classesObj.classes.map(c => c.iri);
  return nativeTypeTS + '\n' + classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}
