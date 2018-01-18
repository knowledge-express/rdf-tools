export declare const defaultConfig: {
    context: boolean;
};
export declare type Config = {
    [P in keyof typeof defaultConfig]?: typeof defaultConfig[P];
};
export declare function getConfig(config: Config): Config;
