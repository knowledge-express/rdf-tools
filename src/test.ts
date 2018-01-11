
export module prefixes {
    export const rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    export const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    export const xsd = "http://www.w3.org/2001/XMLSchema#";
    export const owl = "http://www.w3.org/2002/07/owl#";
    export const skos = "http://www.w3.org/2004/02/skos/core#";
    export const schema = "http://schema.org/";
    export const mag = "http://academic.microsoft.com/";
    export const oa = "http://www.w3.org/ns/oa#";
    export const $ = "https://knowledge.express/";
};

export module iris {
    export module $ {
        export const Annotation = "https://knowledge.express/Annotation";
        export const Tag = "https://knowledge.express/Tag";
        export const startPosition = "https://knowledge.express/startPosition";
        export const confidence = "https://knowledge.express/confidence";
        export const detectedAs = "https://knowledge.express/detectedAs";
        export const Document = "https://knowledge.express/Document";
        export const Resource = "https://knowledge.express/Resource";
        export const Taggable = "https://knowledge.express/Taggable";
        export const section = "https://knowledge.express/section";
        export const DocumentSection = "https://knowledge.express/DocumentSection";
        export const sectionOf = "https://knowledge.express/sectionOf";
        export const endPosition = "https://knowledge.express/endPosition";
        export const topic = "https://knowledge.express/topic";
        export const Topic = "https://knowledge.express/Topic";
        export const resource = "https://knowledge.express/resource";
        export const tag = "https://knowledge.express/tag";
        export const annotation = "https://knowledge.express/annotation";
        export const Video = "https://knowledge.express/Video";
        export const caption = "https://knowledge.express/caption";
        export const VideoCaption = "https://knowledge.express/VideoCaption";
        export const captionOf = "https://knowledge.express/captionOf";
        export const CreativeWork = "https://knowledge.express/CreativeWork";
        export const startsAfter = "https://knowledge.express/startsAfter";
        export const duration = "https://knowledge.express/duration";
        export const Entity = "https://knowledge.express/Entity";
        export const fieldOfStudy = "https://knowledge.express/fieldOfStudy";
        export const entity = "https://knowledge.express/entity";
        export const score = "https://knowledge.express/score";
        export const subjectOf = "https://knowledge.express/subjectOf";
        export const about = "https://knowledge.express/about";
        export const previous = "https://knowledge.express/previous";
        export const next = "https://knowledge.express/next";
        export const parent = "https://knowledge.express/parent";
        export const child = "https://knowledge.express/child";
    };
    export module rdf {
        export const type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    };
    export module owl {
        export const Class = "http://www.w3.org/2002/07/owl#Class";
        export const ObjectProperty = "http://www.w3.org/2002/07/owl#ObjectProperty";
        export const FunctionalProperty = "http://www.w3.org/2002/07/owl#FunctionalProperty";
        export const Thing = "http://www.w3.org/2002/07/owl#Thing";
        export const inverseOf = "http://www.w3.org/2002/07/owl#inverseOf";
        export const DatatypeProperty = "http://www.w3.org/2002/07/owl#DatatypeProperty";
        export const sameAs = "http://www.w3.org/2002/07/owl#sameAs";
    };
    export module rdfs {
        export const subClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
        export const domain = "http://www.w3.org/2000/01/rdf-schema#domain";
        export const range = "http://www.w3.org/2000/01/rdf-schema#range";
        export const subPropertyOf = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
    };
    export module xsd {
        export const integer = "http://www.w3.org/2001/XMLSchema#integer";
        export const decimal = "http://www.w3.org/2001/XMLSchema#decimal";
        export const string = "http://www.w3.org/2001/XMLSchema#string";
        export const duration = "http://www.w3.org/2001/XMLSchema#duration";
    };
    export module schema {
        export const CreativeWork = "http://schema.org/CreativeWork";
        export const name = "http://schema.org/name";
        export const description = "http://schema.org/description";
        export const image = "http://schema.org/image";
        export const license = "http://schema.org/license";
        export const sourceOrganization = "http://schema.org/sourceOrganization";
        export const text = "http://schema.org/text";
        export const VideoObject = "http://schema.org/VideoObject";
        export const about = "http://schema.org/about";
    };
    export module mag {
        export const FieldOfStudy = "http://academic.microsoft.com/FieldOfStudy";
        export const parentFieldOfStudy = "http://academic.microsoft.com/parentFieldOfStudy";
        export const childFieldOfStudy = "http://academic.microsoft.com/childFieldOfStudy";
    };
    export module oa {
        export const SemanticTag = "http://www.w3.org/ns/oa#SemanticTag";
    };
};

export type duration = string;
export type integer = number;
export type decimal = number;
export type Annotation = Tag & {
    startPosition: integer
    confidence: decimal
    detectedAs: string
};

export type CreativeWork = {
    name: string
    description: string
    image: string[]
    license: string[]
    sourceOrganization: string[]
    text: string[]
};

export type Document = (Resource & Taggable) & {
    section: DocumentSection[]
};

export type DocumentSection = CreativeWork & {
    sectionOf: Document[]
    startPosition: integer
    endPosition: integer
};

export type Resource = CreativeWork & {
    topic: Topic[]
    tag: Tag[]
    annotation: Annotation[]
};

export type Video = (Resource & Taggable) & {
    caption: VideoCaption[]
};

export type VideoCaption = Taggable & {
    captionOf: Video[]
    startsAfter: duration
    duration: duration
};

export type Entity = {
    fieldOfStudy: FieldOfStudy[]
    tag: Tag[]
    annotation: Annotation[]
    name: string
    description: string
};

export type FieldOfStudy = {
    entity: Entity[]
    name: string
    description: string
    image: string[]
    resource: Resource[]
    parentFieldOfStudy: FieldOfStudy[]
    childFieldOfStudy: FieldOfStudy[]
};

export type Tag = {
    resource: Resource[]
    entity: Entity[]
    score: decimal
};

export type Taggable = {
    tag: Tag[]
    annotation: Annotation[]
};

export type Topic = CreativeWork & {
    resource: Resource[]
    previous: Topic[]
    next: Topic[]
    parent: Topic[]
    child: Topic[]
};


export function isDuration(obj: any): obj is duration {
    return typeof obj === "string";
}
export function isInteger(obj: any): obj is integer {
    return typeof obj === "number";
}
export function isDecimal(obj: any): obj is decimal {
    return typeof obj === "number";
}
export function isAnnotation(obj: any): obj is Annotation {
    return isTag(obj) &&
        ("startPosition" in obj && obj["startPosition"] != null && isInteger(obj["startPosition"])) &&
        ("confidence" in obj && obj["confidence"] != null && isDecimal(obj["confidence"])) &&
        ("detectedAs" in obj && obj["detectedAs"] != null && typeof obj["detectedAs"] === "string");
}
export function isCreativeWork(obj: any): obj is CreativeWork {
    return ("name" in obj && obj["name"] != null && typeof obj["name"] === "string") &&
        ("description" in obj && obj["description"] != null && typeof obj["description"] === "string") &&
        ("image" in obj && obj["image"] != null && obj["image"].reduce((memo, value) => typeof value === "string", true)) &&
        ("license" in obj && obj["license"] != null && obj["license"].reduce((memo, value) => typeof value === "string", true)) &&
        ("sourceOrganization" in obj && obj["sourceOrganization"] != null && obj["sourceOrganization"].reduce((memo, value) => typeof value === "string", true)) &&
        ("text" in obj && obj["text"] != null && obj["text"].reduce((memo, value) => typeof value === "string", true));
}
export function isDocument(obj: any): obj is Document {
    return isResource(obj) &&
        isTaggable(obj) &&
        ("section" in obj && obj["section"] != null && obj["section"].reduce((memo, value) => isDocumentSection(value), true));
}
export function isDocumentSection(obj: any): obj is DocumentSection {
    return isCreativeWork(obj) &&
        ("sectionOf" in obj && obj["sectionOf"] != null && obj["sectionOf"].reduce((memo, value) => isDocument(value), true)) &&
        ("startPosition" in obj && obj["startPosition"] != null && isInteger(obj["startPosition"])) &&
        ("endPosition" in obj && obj["endPosition"] != null && isInteger(obj["endPosition"]));
}
export function isResource(obj: any): obj is Resource {
    return isCreativeWork(obj) &&
        ("topic" in obj && obj["topic"] != null && obj["topic"].reduce((memo, value) => isTopic(value), true)) &&
        ("tag" in obj && obj["tag"] != null && obj["tag"].reduce((memo, value) => isTag(value), true)) &&
        ("annotation" in obj && obj["annotation"] != null && obj["annotation"].reduce((memo, value) => isAnnotation(value), true));
}
export function isVideo(obj: any): obj is Video {
    return isResource(obj) &&
        isTaggable(obj) &&
        ("caption" in obj && obj["caption"] != null && obj["caption"].reduce((memo, value) => isVideoCaption(value), true));
}
export function isVideoCaption(obj: any): obj is VideoCaption {
    return isTaggable(obj) &&
        ("captionOf" in obj && obj["captionOf"] != null && obj["captionOf"].reduce((memo, value) => isVideo(value), true)) &&
        ("startsAfter" in obj && obj["startsAfter"] != null && isDuration(obj["startsAfter"])) &&
        ("duration" in obj && obj["duration"] != null && isDuration(obj["duration"]));
}
export function isEntity(obj: any): obj is Entity {
    return ("fieldOfStudy" in obj && obj["fieldOfStudy"] != null && obj["fieldOfStudy"].reduce((memo, value) => isFieldOfStudy(value), true)) &&
        ("tag" in obj && obj["tag"] != null && obj["tag"].reduce((memo, value) => isTag(value), true)) &&
        ("annotation" in obj && obj["annotation"] != null && obj["annotation"].reduce((memo, value) => isAnnotation(value), true)) &&
        ("name" in obj && obj["name"] != null && typeof obj["name"] === "string") &&
        ("description" in obj && obj["description"] != null && typeof obj["description"] === "string");
}
export function isFieldOfStudy(obj: any): obj is FieldOfStudy {
    return ("entity" in obj && obj["entity"] != null && obj["entity"].reduce((memo, value) => isEntity(value), true)) &&
        ("name" in obj && obj["name"] != null && typeof obj["name"] === "string") &&
        ("description" in obj && obj["description"] != null && typeof obj["description"] === "string") &&
        ("image" in obj && obj["image"] != null && obj["image"].reduce((memo, value) => typeof value === "string", true)) &&
        ("resource" in obj && obj["resource"] != null && obj["resource"].reduce((memo, value) => isResource(value), true)) &&
        ("parentFieldOfStudy" in obj && obj["parentFieldOfStudy"] != null && obj["parentFieldOfStudy"].reduce((memo, value) => isFieldOfStudy(value), true)) &&
        ("childFieldOfStudy" in obj && obj["childFieldOfStudy"] != null && obj["childFieldOfStudy"].reduce((memo, value) => isFieldOfStudy(value), true));
}
export function isTag(obj: any): obj is Tag {
    return ("resource" in obj && obj["resource"] != null && obj["resource"].reduce((memo, value) => isResource(value), true)) &&
        ("entity" in obj && obj["entity"] != null && obj["entity"].reduce((memo, value) => isEntity(value), true)) &&
        ("score" in obj && obj["score"] != null && isDecimal(obj["score"]));
}
export function isTaggable(obj: any): obj is Taggable {
    return ("tag" in obj && obj["tag"] != null && obj["tag"].reduce((memo, value) => isTag(value), true)) &&
        ("annotation" in obj && obj["annotation"] != null && obj["annotation"].reduce((memo, value) => isAnnotation(value), true));
}
export function isTopic(obj: any): obj is Topic {
    return isCreativeWork(obj) &&
        ("resource" in obj && obj["resource"] != null && obj["resource"].reduce((memo, value) => isResource(value), true)) &&
        ("previous" in obj && obj["previous"] != null && obj["previous"].reduce((memo, value) => isTopic(value), true)) &&
        ("next" in obj && obj["next"] != null && obj["next"].reduce((memo, value) => isTopic(value), true)) &&
        ("parent" in obj && obj["parent"] != null && obj["parent"].reduce((memo, value) => isTopic(value), true)) &&
        ("child" in obj && obj["child"] != null && obj["child"].reduce((memo, value) => isTopic(value), true));
}
export default {
    prefixes,
    iris
};
