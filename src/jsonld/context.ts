const semtools = require('semantic-toolkit');
import { Property, Class } from '../model';

export function classToContextByPrefix(classObj: Class) {
  const contextsByPrefix = classObj.properties.reduce((memo, property) => {
    const prefix = semtools.getNamespace(property.iri);
    const name = semtools.getLocalName(property.iri);

    // console.log(`Property ${property.iri} is native? `, property.isNative);
    const context = property.isNative ?
      (property.isFunctional ? property.iri : { "@id": property.iri, "@container": "@set" }) :
      (property.isFunctional ? { "@id": property.iri, "@type": "@id" } : { "@id": property.iri, "@type": "@id", "@container": "@set" });

    if (prefix in memo) memo[prefix][name] = context;
    else memo[prefix] = { [name]: context };

    return memo;
  }, {});

  return [ classObj.iri, ...classObj.superClasses, ...classObj.subClasses].reduce((memo, iri) => {
    const prefix = semtools.getNamespace(iri);
    const name = semtools.getLocalName(iri);

    if (prefix in contextsByPrefix) contextsByPrefix[prefix][name] = iri;
    else contextsByPrefix[prefix] = { [name]: iri };

    return memo;
  }, contextsByPrefix);
  // return contextsByPrefix;
}

export function getContext(prefixes: Object, classes: Class[]) {
  const contextsByPrefix = classes.map(classToContextByPrefix).reduce((memo, contexts) => {
    return Object.keys(contexts).reduce((memo, prefix) => {
      if (prefix in memo) memo[prefix] = { ...memo[prefix], ...contexts[prefix] };
      else memo[prefix] = contexts[prefix];
      return memo;
    }, memo);
  }, {});

  return Object.keys(contextsByPrefix).map(prefix => {
    const context = contextsByPrefix[prefix];
    return {
      "@vocab": prefix,
      ...context
    };
  });
  // return Object.keys(prefixes).map((memo, key) => {
  //   const prefix = prefixes[key];
  //   if (prefix in contextsByPrefix)
  // }, {});
  // return {
  //   "VideoObject": {
  //     "@id": "http://schema.org/VideoObject",
  //     "@context": {
  //       "name": "http://schema.org/name",
  //       "description": "http://schema.org/description"
  //     }
  //   }
  // };
};
