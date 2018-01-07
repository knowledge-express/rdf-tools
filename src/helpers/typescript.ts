const semtools = require('semantic-toolkit');
import * as formatter from 'typescript-formatter';

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

export function classesToTS(classesObj: { classes: Class[] }): string {
  const iris = classesObj.classes.map(c => c.iri);
  return classesObj.classes.map(c => classToTS(c, iris)).join('\n');
}

export function objectToTSModule(obj): string {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    var str: string;

    if (typeof value === 'string') str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
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
  return `\n\nexport default {\n${defaultExports.join(',\n')}\n};`;
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
