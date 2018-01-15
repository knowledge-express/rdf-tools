import * as formatter from 'typescript-formatter';
export declare const formatterOptions: {
    replace: boolean;
    verify: boolean;
    tsconfig: boolean;
    tsconfigFile: any;
    tslint: boolean;
    tslintFile: any;
    editorconfig: boolean;
    vscode: boolean;
    vscodeFile: any;
    tsfmt: boolean;
    tsfmtFile: any;
};
export declare function formatTS(ts: string, options?: formatter.Options): Promise<string>;
