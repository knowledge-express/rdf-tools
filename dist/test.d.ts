export declare module prefixes {
    const rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    const xsd = "http://www.w3.org/2001/XMLSchema#";
    const owl = "http://www.w3.org/2002/07/owl#";
    const skos = "http://www.w3.org/2004/02/skos/core#";
    const schema = "http://schema.org/";
    const mag = "http://academic.microsoft.com/";
    const oa = "http://www.w3.org/ns/oa#";
    const $ = "https://knowledge.express/";
}
export declare module iris {
    module $ {
        const Annotation = "https://knowledge.express/Annotation";
        const Tag = "https://knowledge.express/Tag";
        const startPosition = "https://knowledge.express/startPosition";
        const confidence = "https://knowledge.express/confidence";
        const detectedAs = "https://knowledge.express/detectedAs";
        const Entity = "https://knowledge.express/Entity";
        const Document = "https://knowledge.express/Document";
        const Resource = "https://knowledge.express/Resource";
        const Taggable = "https://knowledge.express/Taggable";
        const section = "https://knowledge.express/section";
        const DocumentSection = "https://knowledge.express/DocumentSection";
        const sectionOf = "https://knowledge.express/sectionOf";
        const endPosition = "https://knowledge.express/endPosition";
        const topic = "https://knowledge.express/topic";
        const Topic = "https://knowledge.express/Topic";
        const resource = "https://knowledge.express/resource";
        const tag = "https://knowledge.express/tag";
        const annotation = "https://knowledge.express/annotation";
        const about = "https://knowledge.express/about";
        const subjectOf = "https://knowledge.express/subjectOf";
        const Video = "https://knowledge.express/Video";
        const caption = "https://knowledge.express/caption";
        const VideoCaption = "https://knowledge.express/VideoCaption";
        const captionOf = "https://knowledge.express/captionOf";
        const CreativeWork = "https://knowledge.express/CreativeWork";
        const startsAfter = "https://knowledge.express/startsAfter";
        const duration = "https://knowledge.express/duration";
        const fieldOfStudy = "https://knowledge.express/fieldOfStudy";
        const entity = "https://knowledge.express/entity";
        const score = "https://knowledge.express/score";
        const previous = "https://knowledge.express/previous";
        const next = "https://knowledge.express/next";
        const parent = "https://knowledge.express/parent";
        const child = "https://knowledge.express/child";
    }
    module rdf {
        const type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    }
    module owl {
        const Class = "http://www.w3.org/2002/07/owl#Class";
        const DatatypeProperty = "http://www.w3.org/2002/07/owl#DatatypeProperty";
        const Thing = "http://www.w3.org/2002/07/owl#Thing";
        const ObjectProperty = "http://www.w3.org/2002/07/owl#ObjectProperty";
        const FunctionalProperty = "http://www.w3.org/2002/07/owl#FunctionalProperty";
        const inverseOf = "http://www.w3.org/2002/07/owl#inverseOf";
        const sameAs = "http://www.w3.org/2002/07/owl#sameAs";
    }
    module rdfs {
        const subClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
        const domain = "http://www.w3.org/2000/01/rdf-schema#domain";
        const range = "http://www.w3.org/2000/01/rdf-schema#range";
        const subPropertyOf = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
    }
    module xsd {
        const integer = "http://www.w3.org/2001/XMLSchema#integer";
        const decimal = "http://www.w3.org/2001/XMLSchema#decimal";
        const string = "http://www.w3.org/2001/XMLSchema#string";
        const duration = "http://www.w3.org/2001/XMLSchema#duration";
    }
    module schema {
        const CreativeWork = "http://schema.org/CreativeWork";
        const name = "http://schema.org/name";
        const description = "http://schema.org/description";
        const image = "http://schema.org/image";
        const license = "http://schema.org/license";
        const sourceOrganization = "http://schema.org/sourceOrganization";
        const text = "http://schema.org/text";
        const about = "http://schema.org/about";
        const subjectOf = "http://schema.org/subjectOf";
        const VideoObject = "http://schema.org/VideoObject";
    }
    module mag {
        const FieldOfStudy = "http://academic.microsoft.com/FieldOfStudy";
        const parentFieldOfStudy = "http://academic.microsoft.com/parentFieldOfStudy";
        const childFieldOfStudy = "http://academic.microsoft.com/childFieldOfStudy";
    }
    module oa {
        const SemanticTag = "http://www.w3.org/ns/oa#SemanticTag";
    }
}
export declare type duration = string;
export declare type integer = number;
export declare type decimal = number;
export declare type Annotation = Tag & {
    startPosition: integer;
    confidence: decimal[];
    detectedAs: string[];
};
export declare type CreativeWork = {
    name: string;
    description: string;
    image: string[];
    license: string[];
    sourceOrganization: string[];
    text: string[];
    about: Entity[];
};
export declare type Document = (Resource & Taggable) & {
    section: DocumentSection[];
};
export declare type DocumentSection = CreativeWork & {
    sectionOf: Document[];
    startPosition: integer;
    endPosition: integer;
};
export declare type Resource = CreativeWork & {
    topic: Topic[];
    tag: Tag[];
    annotation: Annotation[];
    about: Entity[];
};
export declare type Video = (Resource & Taggable) & {
    caption: VideoCaption[];
};
export declare type VideoCaption = Taggable & {
    captionOf: Video[];
    startsAfter: duration;
    duration: duration;
};
export declare type Entity = {
    fieldOfStudy: FieldOfStudy[];
    tag: Tag[];
    annotation: Annotation[];
    subjectOf: Resource[];
    name: string;
    description: string;
};
export declare type FieldOfStudy = {
    entity: Entity[];
    name: string;
    description: string;
    resource: Resource[];
    parentFieldOfStudy: FieldOfStudy[];
    childFieldOfStudy: FieldOfStudy[];
};
export declare type Tag = {
    resource: Resource[];
    entity: Entity[];
    score: decimal[];
};
export declare type Taggable = {
    tag: Tag[];
    annotation: Annotation[];
};
export declare type Topic = CreativeWork & {
    resource: Resource[];
    previous: Topic[];
    next: Topic[];
    parent: Topic[];
    child: Topic[];
};
declare const _default: {
    prefixes: typeof prefixes;
    iris: typeof iris;
};
export default _default;
