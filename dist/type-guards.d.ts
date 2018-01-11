import { Class } from './classes';
export declare function getTypeGuards(ontology: any): Promise<{
    exports: string[];
    typeGuards: Array<Class>;
}>;
