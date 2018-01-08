"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prefixes;
(function (prefixes) {
    prefixes.rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    prefixes.rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    prefixes.xsd = "http://www.w3.org/2001/XMLSchema#";
    prefixes.owl = "http://www.w3.org/2002/07/owl#";
    prefixes.skos = "http://www.w3.org/2004/02/skos/core#";
    prefixes.schema = "http://schema.org/";
    prefixes.mag = "http://academic.microsoft.com/";
    prefixes.oa = "http://www.w3.org/ns/oa#";
    prefixes.$ = "https://knowledge.express/";
})(prefixes = exports.prefixes || (exports.prefixes = {}));
;
var iris;
(function (iris) {
    let $;
    (function ($) {
        $.Annotation = "https://knowledge.express/Annotation";
        $.Tag = "https://knowledge.express/Tag";
        $.startPosition = "https://knowledge.express/startPosition";
        $.confidence = "https://knowledge.express/confidence";
        $.detectedAs = "https://knowledge.express/detectedAs";
        $.Entity = "https://knowledge.express/Entity";
        $.Document = "https://knowledge.express/Document";
        $.Resource = "https://knowledge.express/Resource";
        $.Taggable = "https://knowledge.express/Taggable";
        $.section = "https://knowledge.express/section";
        $.DocumentSection = "https://knowledge.express/DocumentSection";
        $.sectionOf = "https://knowledge.express/sectionOf";
        $.endPosition = "https://knowledge.express/endPosition";
        $.topic = "https://knowledge.express/topic";
        $.Topic = "https://knowledge.express/Topic";
        $.resource = "https://knowledge.express/resource";
        $.tag = "https://knowledge.express/tag";
        $.annotation = "https://knowledge.express/annotation";
        $.about = "https://knowledge.express/about";
        $.subjectOf = "https://knowledge.express/subjectOf";
        $.Video = "https://knowledge.express/Video";
        $.caption = "https://knowledge.express/caption";
        $.VideoCaption = "https://knowledge.express/VideoCaption";
        $.captionOf = "https://knowledge.express/captionOf";
        $.CreativeWork = "https://knowledge.express/CreativeWork";
        $.startsAfter = "https://knowledge.express/startsAfter";
        $.duration = "https://knowledge.express/duration";
        $.fieldOfStudy = "https://knowledge.express/fieldOfStudy";
        $.entity = "https://knowledge.express/entity";
        $.score = "https://knowledge.express/score";
        $.previous = "https://knowledge.express/previous";
        $.next = "https://knowledge.express/next";
        $.parent = "https://knowledge.express/parent";
        $.child = "https://knowledge.express/child";
    })($ = iris.$ || (iris.$ = {}));
    ;
    let rdf;
    (function (rdf) {
        rdf.type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    })(rdf = iris.rdf || (iris.rdf = {}));
    ;
    let owl;
    (function (owl) {
        owl.Class = "http://www.w3.org/2002/07/owl#Class";
        owl.DatatypeProperty = "http://www.w3.org/2002/07/owl#DatatypeProperty";
        owl.Thing = "http://www.w3.org/2002/07/owl#Thing";
        owl.ObjectProperty = "http://www.w3.org/2002/07/owl#ObjectProperty";
        owl.FunctionalProperty = "http://www.w3.org/2002/07/owl#FunctionalProperty";
        owl.inverseOf = "http://www.w3.org/2002/07/owl#inverseOf";
        owl.sameAs = "http://www.w3.org/2002/07/owl#sameAs";
    })(owl = iris.owl || (iris.owl = {}));
    ;
    let rdfs;
    (function (rdfs) {
        rdfs.subClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
        rdfs.domain = "http://www.w3.org/2000/01/rdf-schema#domain";
        rdfs.range = "http://www.w3.org/2000/01/rdf-schema#range";
        rdfs.subPropertyOf = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
    })(rdfs = iris.rdfs || (iris.rdfs = {}));
    ;
    let xsd;
    (function (xsd) {
        xsd.integer = "http://www.w3.org/2001/XMLSchema#integer";
        xsd.decimal = "http://www.w3.org/2001/XMLSchema#decimal";
        xsd.string = "http://www.w3.org/2001/XMLSchema#string";
        xsd.duration = "http://www.w3.org/2001/XMLSchema#duration";
    })(xsd = iris.xsd || (iris.xsd = {}));
    ;
    let schema;
    (function (schema) {
        schema.CreativeWork = "http://schema.org/CreativeWork";
        schema.name = "http://schema.org/name";
        schema.description = "http://schema.org/description";
        schema.image = "http://schema.org/image";
        schema.license = "http://schema.org/license";
        schema.sourceOrganization = "http://schema.org/sourceOrganization";
        schema.text = "http://schema.org/text";
        schema.about = "http://schema.org/about";
        schema.subjectOf = "http://schema.org/subjectOf";
        schema.VideoObject = "http://schema.org/VideoObject";
    })(schema = iris.schema || (iris.schema = {}));
    ;
    let mag;
    (function (mag) {
        mag.FieldOfStudy = "http://academic.microsoft.com/FieldOfStudy";
        mag.parentFieldOfStudy = "http://academic.microsoft.com/parentFieldOfStudy";
        mag.childFieldOfStudy = "http://academic.microsoft.com/childFieldOfStudy";
    })(mag = iris.mag || (iris.mag = {}));
    ;
    let oa;
    (function (oa) {
        oa.SemanticTag = "http://www.w3.org/ns/oa#SemanticTag";
    })(oa = iris.oa || (iris.oa = {}));
    ;
})(iris = exports.iris || (exports.iris = {}));
;
exports.default = {
    prefixes,
    iris
};
