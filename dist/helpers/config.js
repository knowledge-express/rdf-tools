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
    if (!('prefixes' in config ||
        'iris' in config ||
        'classes' in config ||
        'typeGuards' in config))
        return exports.defaultConfig;
    return config;
}
exports.getConfig = getConfig;
