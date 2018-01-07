import * as N3 from 'n3';
export declare type Property = {
    iri: string;
    range: string[];
    isFunctional: boolean;
};
export declare type Class = {
    iri: string;
    superClasses: Array<string>;
    properties: Array<Property>;
};
export declare function getFiles(patterns: Array<string>): Promise<Array<string>>;
export declare function getOntology(pattern: any): Promise<string>;
export declare function getPrefixes(ontology: any): Promise<{
    [index: string]: string;
}>;
export declare function invertObject(obj: {
    [index: string]: string;
}): {
    [index: string]: string;
};
export declare function getTriples(ontology: any): Array<N3.Triple>;
export declare function getRDFGraph(ontology: any): any;
export declare function getGraph(ontology: any): Promise<Object>;
export declare function expandProperty(graph: any, iri: string): Object;
export declare function expandClass(graph: any, iri: string): Object;
export declare function getClasses(ontology: any): Promise<Array<Class>>;
export declare function typeForIris(iris: string[]): string;
export declare function propertyToTS(propertyObj: Property): string;
export declare function classToTS(classObj: Class, classIris?: string[]): string;
export declare function graphToTS(obj: any): string;
