import * as formatter from 'typescript-formatter';
import { Property, Class } from '../classes';
export declare function typeForIris(iris: string[]): string;
export declare function nativeTypesToTS(): string;
export declare function propertyToTS(propertyObj: Property): string;
export declare function classToTS(classObj: Class, classIris?: string[]): string;
export declare function classesToTS(classesObj: {
    classes: Class[];
}): string;
export declare function objectToTSModule(obj: any): string;
export declare function prefixesToTS({prefixes}: {
    prefixes: string[];
}): string;
export declare function IRIsToTS({iris}: {
    iris: string[];
}): string;
export declare function literalsToTS({literals}: {
    literals: string[];
}): string;
export declare function defaultExportsToTS(defaultExports: string[]): string;
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
