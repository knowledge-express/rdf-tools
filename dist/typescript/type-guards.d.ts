import { Class } from '../model';
export declare function nativeTypesToTypeGuardTS(): string;
export declare function getTypeGuardName(typeName: string): string;
export declare type TypeGuardOptions = {
    allowUndefinedProperties?: boolean;
    allowNullProperties?: boolean;
    typeCheckEnabled?: boolean;
    propertyTypeCheckEnabled?: boolean;
    inheritance?: boolean;
    completeness?: boolean;
};
export declare const defaultTypeGuardOptions: TypeGuardOptions;
export declare function classToTypeGuardTS(classObj: Class, classIris: string[], options?: TypeGuardOptions): string;
export declare function typeGuardsToTS(typeGuardsObj: {
    typeGuards: Class[];
}): string;
