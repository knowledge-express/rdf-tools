import * as fs from 'fs';
import * as globby from 'globby';

export async function getFiles(patterns: Array<string>): Promise<Array<string>> {
  // console.log('globbing pattern', patterns);
  const paths = await globby(patterns, <any>{ expandDirectories: true })
  // console.log('Got paths:', paths);
  return paths.map(name => fs.readFileSync(name).toString());
}

export async function getOntology(pattern) {
  const files = await getFiles(pattern);
  return files.reduce((memo, data) => {
    return memo + '\n' + data;
  }, '');
}
