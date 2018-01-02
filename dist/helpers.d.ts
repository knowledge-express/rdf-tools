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
export declare function getGraph(ontology: any): Promise<Object>;
export declare function tsify(graph: any): string;
