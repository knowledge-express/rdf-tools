const semtools = require('semantic-toolkit');
import * as formatter from 'typescript-formatter';

import { Property, Class } from '../classes';

// Mappings with the same local name should be avoid as they attempt to alias the native type with itself
const nativeTypeMap = {
  boolean: {
    // 'http://www.w3.org/2001/XMLSchema#boolean': true,
  },
  string: {
    // 'http://www.w3.org/2001/XMLSchema#string': true,
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
    const [ iri ] = iris;
    return semtools.getLocalName(iri);
  }

  const [ first, ...rest ] = iris;
  return `(${typeForIris([ first ])} & ${typeForIris(rest)})`;
}

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
  propertyTypeCheckEnabled?: boolean,
};
export const defaultTypeGuardOptions: TypeGuardOptions = {
  allowUndefinedProperties: true,
  allowNullProperties: true,
  propertyTypeCheckEnabled: false,
};
export function classToTypeGuardTS(classObj: Class, classIris: string[], options: TypeGuardOptions = {}): string {
  const typeGuardOptions = { ...defaultTypeGuardOptions, ...options };
  const typeName = semtools.getLocalName(classObj.iri);
  const typeGuardName = getTypeGuardName(typeName);

  function propertyToPredicate(propertyObj: Property): string {
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
    if (!typeGuardOptions.allowUndefinedProperties) checks.push(undefinedCheck);
    if (!typeGuardOptions.allowNullProperties) checks.push(nullCheck);
    if (typeGuardOptions.propertyTypeCheckEnabled) checks.push(typeCheck);

    return `(${checks.join(' && ')})`;
  }

  function superClassToPredicate(superClassIRI: string) {
    const name = semtools.getLocalName(superClassIRI);
    return `${getTypeGuardName(name)}(obj)`;
  }

  const objExists = `obj != null`;
  const existingSuperClasses = classObj.superClasses.filter(c => classIris.indexOf(c) != -1);
  const predicates = [].concat(objExists, existingSuperClasses.map(superClassToPredicate), classObj.properties.map(propertyToPredicate));
  return `export function ${typeGuardName}(obj: any): obj is ${typeName} {
    return ${predicates.join(' &&\n')};
  }`;
}

export function classesToTS(classesObj: { classes: Class[] }): string {
  const nativeTypeTS = nativeTypesToTS();
  const iris = classesObj.classes.map(c => c.iri);
  return nativeTypeTS + '\n' + classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}

export function typeGuardsToTS(typeGuardsObj: { typeGuards: Class[] }): string {
  const nativeTypesTypeGuardTS = nativeTypesToTypeGuardTS();
  const iris = typeGuardsObj.typeGuards.map(c => c.iri);
  return nativeTypesTypeGuardTS + '\n' + typeGuardsObj.typeGuards.map(c => classToTypeGuardTS(c, iris)).join('\n');
}

export function objectToTSModule(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
    // else if (value instanceof Array) str = `export enum ${key} { }`;
    else str = `\nexport module ${key} { ${objectToTSModule(value)} };`;

    return memo + str;
  }, ``);
}

export function prefixesToTS({ prefixes }: { prefixes: string[] }): string {
  return objectToTSModule({ prefixes });
}

export function IRIsToTS({ iris }: { iris: string[] }): string {
  return objectToTSModule({ iris });
}

export function literalsToTS({ literals }: { literals: string[] }): string {
  return objectToTSModule({ literals });
}

export function defaultExportsToTS(defaultExports: string[]): string {
  return `export default {\n${defaultExports.join(',\n')}};`;
}

export const formatterOptions = {
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

export async function formatTS(ts: string, options: formatter.Options = formatterOptions): Promise<string> {
   return (await formatter.processString('', ts, formatterOptions)).dest;
}
