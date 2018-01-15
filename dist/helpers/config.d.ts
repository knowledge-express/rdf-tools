export declare const defaultConfig: {
    prefixes: boolean;
    iris: boolean;
    literals: boolean;
    classes: boolean;
    typeGuards: boolean;
    defaultExports: boolean;
};
export declare type Config = {
    [P in keyof typeof defaultConfig]?: typeof defaultConfig[P];
};
export declare function getConfig(config: Config): Config;
