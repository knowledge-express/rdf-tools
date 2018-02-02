const semtools = require('semantic-toolkit');
import { typeForIris } from '.';

import { Property, Class, nativeTypeMap } from '../model';

export function nativeTypesToTS() {
  return Object.keys(nativeTypeMap).map(nativeType => {
    const iris = Object.keys(nativeTypeMap[nativeType]);
    return iris.map(iri => {
      const aliasType = typeForIris([ iri ]);
      // Skip when aliasing types to themselves
      if (nativeType === aliasType) return '';
      return `export type ${aliasType} = ${nativeType};`
    }).join('\n')
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
  const superTypes = existingSuperClasses.length === 0 ? 'RDF.Resource &' : `${typeForIris(existingSuperClasses)} &`;

  return `export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}

export function rdfResourceToTS() {
  return `export module RDF {
    export type Resource = {
      id: string
    };
  };`;
}

export function classToTSAliases(classObj: Class, classIris: string[]): string[] {
  const name = semtools.getLocalName(classObj.iri);
  const propertyRanges = classObj.properties.reduce((memo, property) => [ ...memo, ...(property.isNative ? [] : property.range) ], []);
  const nonExistingPropertyClasses = propertyRanges.filter(c => classIris.indexOf(c) == -1);
  const nonExistingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) == -1);
  const nonExistingClasses = Object.keys([ ...nonExistingPropertyClasses, ...nonExistingSuperClasses ].reduce((memo, key) => ({ ...memo, [key]: true }), {}));
  // console.log(nonExistingClasses);
  return nonExistingClasses;
}

export function aliasRDFResources(classesObj: { classes: Class[] }): string {
  const iris = classesObj.classes.map(c => c.iri);
  const rdfTS = rdfResourceToTS();
  const nonExistingClasses = Object.keys(classesObj.classes.reduce((memo, c) => [ ...memo, ...classToTSAliases(c, iris) ], []).reduce((memo, key) => ({ ...memo, [key]: true }), {}));
  const aliasesTS = nonExistingClasses.map(iri => {
    const aliasType = typeForIris([ iri ]);
    return `export type ${aliasType} = RDF.Resource;`;
  }).join('\n');

  return rdfTS + '\n' + aliasesTS;
}

export function classesToTS(classesObj: { classes: Class[] }): string {
  const nativeTypeTS = nativeTypesToTS();
  const aliasesTS = aliasRDFResources(classesObj);
  const iris = classesObj.classes.map(c => c.iri);
  return nativeTypeTS + '\n' + aliasesTS + '\n' + classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}
