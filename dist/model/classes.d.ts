export declare type Property = {
    iri: string;
    range: string[];
    isFunctional: boolean;
    isNative: boolean;
};
export declare type Class = {
    iri: string;
    superClasses: Array<string>;
    subClasses: Array<string>;
    properties: Array<Property>;
};
export declare const nativeTypeMap: {
    boolean: {
        'http://www.w3.org/2001/XMLSchema#boolean': boolean;
    };
    string: {
        'http://www.w3.org/2001/XMLSchema#string': boolean;
        'http://www.w3.org/2001/XMLSchema#duration': boolean;
    };
    number: {
        'http://www.w3.org/2001/XMLSchema#integer': boolean;
        'http://www.w3.org/2001/XMLSchema#decimal': boolean;
    };
};
export declare function isNativeType(iris: string[]): boolean;
export declare function expandProperty(graph: any, iri: string): Object;
export declare function expandClass(graph: any, iri: string): Object;
export declare function getClasses(ontology: any): Promise<{
    exports: string[];
    classes: Array<Class>;
}>;
