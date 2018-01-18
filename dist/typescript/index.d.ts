export declare const nativeTypeMap: {
    boolean: {};
    string: {
        'http://www.w3.org/2001/XMLSchema#duration': boolean;
    };
    number: {
        'http://www.w3.org/2001/XMLSchema#integer': boolean;
        'http://www.w3.org/2001/XMLSchema#decimal': boolean;
    };
};
export declare function typeForIris(iris: string[]): string;
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
export * from './command';
export * from './config';
export * from './format';
export * from './type-guards';
export * from './types';
