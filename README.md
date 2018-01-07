# rdf-to-ts
Generate TypeScript from RDF.

## Installation
```
npm install -g rdf-to-ts
```

## Usage
```
rdf-to-ts --help
```

```
Usage: rdf-to-ts [options] <pattern>


Options:

  -V, --version  output the version number
  -h, --help     output usage information
```

## Example
The following command will output types for all classes explicitly defined in the ontology, as well as an object containing the prefixes and IRIs used by the ontology.
```
rdf-to-ts example.ttl > example.ts
```

## How does it work?

<!-- ### Prefixes -->

<!-- ### IRIs and Literals -->

### Classes
In order to construct types for the classes in the ontology we need the following pieces of information for each type:
- `owl:Class`: What is the name of the class?
- `rdfs:subClassOf`: What are its super-classes?
- `rdfs:domain`, `rdfs:range`, `owl:FunctionalProperty`: Property names, types and pluralities.
