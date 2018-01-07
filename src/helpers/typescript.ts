const semtools = require('semantic-toolkit');

import { Property, Class } from '../classes';

const nativeTypeMap = {
  boolean: {
    'http://www.w3.org/2001/XMLSchema#boolean': true,
  },
  string: {
    'http://www.w3.org/2001/XMLSchema#string': true,
    'http://www.w3.org/2001/XMLSchema#duration': true,
  },
  number: {
    'http://www.w3.org/2001/XMLSchema#integer': true,
    'http://www.w3.org/2001/XMLSchema#decimal': true,
  },
};

export function typeForIris(iris: string[]): string {
  if (iris.length === 0) throw new Error('No type for empty iris.');
  if (iris.length === 1) {
    // TODO: Map literal types to native JS types
    const [ iri ] = iris;
    if (iri in nativeTypeMap.boolean) return 'boolean';
    if (iri in nativeTypeMap.number)  return 'number';
    if (iri in nativeTypeMap.string)  return 'string';
    return semtools.getLocalName(iri);
  }

  const [ first, ...rest ] = iris;
  return `(${typeForIris([ first ])} & ${typeForIris(rest)})`;
}

export function propertyToTS(propertyObj: Property): string {
  const name = semtools.getLocalName(propertyObj.iri);
  const type = typeForIris(propertyObj.range);
  const plurality = propertyObj.isFunctional ? '[]' : '';

  return `${name}: ${type}${plurality}`;
}

export function classToTS(classObj: Class, classIris: string[] = []): string {
  const name = semtools.getLocalName(classObj.iri);
  const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
  const superTypes = existingSuperClasses.length === 0 ? '' : `${typeForIris(existingSuperClasses)} &`;

  return `
  export type ${name} = ${superTypes} {
    ${classObj.properties.map(propertyToTS).join('\n')}
  };
  `;
}

export function classesToTS(classes: Class[]) {
  const iris = classes.map(c => c.iri);
  return classes.map(c => classToTS(c, iris)).join('\n');
}

export function IRIsAndLiteralsToTS(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
    else str = `\nexport module ${key} { ${IRIsAndLiteralsToTS(value)}}`;

    return memo + str;
  }, ``);
}
