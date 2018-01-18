"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    prefixes: true,
    iris: true,
    literals: true,
    classes: true,
    typeGuards: true,
    defaultExports: true,
};
function getConfig(config) {
    if (!(config['prefixes'] ||
        config['iris'] ||
        config['classes'] ||
        config['typeGuards']))
        return exports.defaultConfig;
    return config;
}
exports.getConfig = getConfig;
