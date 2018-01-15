import * as formatter from 'typescript-formatter';

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
