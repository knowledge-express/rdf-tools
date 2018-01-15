import { Property, Class } from '../model';
export declare function nativeTypesToTS(): string;
export declare function propertyToTS(propertyObj: Property): string;
export declare function classToTS(classObj: Class, classIris: string[]): string;
export declare function classesToTS(classesObj: {
    classes: Class[];
}): string;
