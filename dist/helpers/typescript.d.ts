import { Property, Class } from '../classes';
export declare function typeForIris(iris: string[]): string;
export declare function propertyToTS(propertyObj: Property): string;
export declare function classToTS(classObj: Class, classIris?: string[]): string;
export declare function classesToTS(classes: Class[]): string;
export declare function IRIsAndLiteralsToTS(obj: any): string;
