# rdf-tools
Tools for RDF.

## Installation
```
npm install -g rdf-tools
```

## Usage
```
rdf-tools --help
```

```
Usage: rdf-tools <command> [options] <pattern>

Commands:
  rdf-tools typescript [options] <pattern>  generate TypeScript from RDF               [aliases: ts]
  rdf-tools jsonld [options] <pattern>      generate JSON-LD from RDF                  [aliases: ld]

Options:
  -D, --debug    output debug information                                                  [boolean]
  -h, --help     Show help                                                                 [boolean]
  -v, --version  Show version number                                                       [boolean]

Happy coding!
```

## Example
The following command will output types for all classes explicitly defined in the ontology, as well as an object containing the prefixes and IRIs used by the ontology.
```
rdf-tools typescript example.ttl > example.ts
```

## How does it work?

<!-- ### Prefixes -->

<!-- ### IRIs and Literals -->

### Classes
In order to construct types for the classes in the ontology we need the following pieces of information for each type:
- `owl:Class`: What is the name of the class?
- `rdfs:subClassOf`: What are its super-classes?
- `rdfs:domain`, `rdfs:range`, `owl:FunctionalProperty`: Property names, types and pluralities.
