import * as N3 from 'n3';
const semtools = require('semantic-toolkit');

export function invertObject(obj: { [index: string]: string }): { [index: string]: string } {
  return Object.keys(obj).reduce((memo, key) => {
    const value = obj[key];
    memo[value] = key;
    return memo;
  }, {});
}

export * from './graph';
export * from './ontology';
export * from './triples';
export * from './typescript';
