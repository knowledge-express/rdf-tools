export declare type Property = {
    iri: string;
    range: string[];
    isFunctional: boolean;
};
export declare type Class = {
    iri: string;
    superClasses: Array<string>;
    subClasses: Array<string>;
    properties: Array<Property>;
};
export declare function expandProperty(graph: any, iri: string): Object;
export declare function expandClass(graph: any, iri: string): Object;
export declare function getClasses(ontology: any): Promise<{
    exports: string[];
    classes: Array<Class>;
}>;
