"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semtools = require('semantic-toolkit');
function classToContextByPrefix(classObj) {
    const contextsByPrefix = classObj.properties.reduce((memo, property) => {
        const prefix = semtools.getNamespace(property.iri);
        const name = semtools.getLocalName(property.iri);
        const context = property.isNative ?
            (property.isFunctional ? property.iri : { "@id": property.iri, "@container": "@set" }) :
            (property.isFunctional ? { "@id": property.iri, "@type": "@id" } : { "@id": property.iri, "@type": "@id", "@container": "@set" });
        if (prefix in memo)
            memo[prefix][name] = context;
        else
            memo[prefix] = { [name]: context };
        return memo;
    }, {});
    return [classObj.iri, ...classObj.superClasses, ...classObj.subClasses].reduce((memo, iri) => {
        const prefix = semtools.getNamespace(iri);
        const name = semtools.getLocalName(iri);
        if (prefix in contextsByPrefix)
            contextsByPrefix[prefix][name] = iri;
        else
            contextsByPrefix[prefix] = { [name]: iri };
        return memo;
    }, contextsByPrefix);
}
exports.classToContextByPrefix = classToContextByPrefix;
function getContext(prefixes, classes) {
    const contextsByPrefix = classes.map(classToContextByPrefix).reduce((memo, contexts) => {
        return Object.keys(contexts).reduce((memo, prefix) => {
            if (prefix in memo)
                memo[prefix] = Object.assign({}, memo[prefix], contexts[prefix]);
            else
                memo[prefix] = contexts[prefix];
            return memo;
        }, memo);
    }, {});
    return Object.keys(contextsByPrefix).map(prefix => {
        const context = contextsByPrefix[prefix];
        return Object.assign({ "@vocab": prefix }, context);
    });
}
exports.getContext = getContext;
;
