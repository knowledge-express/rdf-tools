export declare function typeForIris(iris: string[]): string;
export declare function objectToTSModule(obj: any): string;
export declare function prefixesToTS({ prefixes }: {
    prefixes: string[];
}): string;
export declare function IRIsToTS({ iris }: {
    iris: string[];
}): string;
export declare function literalsToTS({ literals }: {
    literals: string[];
}): string;
export declare function defaultExportsToTS(defaultExports: string[]): string;
export * from './command';
export * from './config';
export * from './format';
export * from './type-guards';
export * from './types';
