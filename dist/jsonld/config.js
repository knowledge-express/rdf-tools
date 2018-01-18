"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    context: true,
};
function getConfig(config) {
    if (Object.keys(exports.defaultConfig).reduce((memo, key) => (memo && !(config[key])), true))
        return exports.defaultConfig;
    return config;
}
exports.getConfig = getConfig;
