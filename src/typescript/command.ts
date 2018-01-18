import * as Model from '../model';
import * as Helpers from '../helpers';
import * as TS from '.';

export async function handleCommand(glob: string, config: TS.Config) {
  if (glob == null) throw new Error('You must enter a glob pattern.');
  const ontology = await Helpers.getOntology(glob);

  let ts = [],
    prefixes = { exports: [], prefixes: null },
    iris = { exports: [], iris: null },
    literals = { exports: [], literals: null },
    classes = { exports: [], classes: null },
    typeGuards = { exports: [], typeGuards: null };

  if (config.prefixes) {
    prefixes = await Model.getPrefixes(ontology);
    ts.push(TS.prefixesToTS(prefixes));
  }

  if (config.iris) {
    iris = await Model.getIRIs(ontology);
    ts.push(TS.IRIsToTS(iris));
  }

  // TODO: This is disabled until we figure out how to expose literals in TS
  // if (config.literals) {
  //   literals = await Model.getLiterals(ontology);
  //   ts.push(TS.literalsToTS(literals));
  // }

  if (config.classes) {
    classes = await Model.getClasses(ontology);
    ts.push(TS.classesToTS(classes));
  }

  if (config.typeGuards) {
    typeGuards = await Model.getTypeGuards(ontology);
    ts.push(TS.typeGuardsToTS(typeGuards));
  }

  if (config.defaultExports) {
    const defaultExports = [].concat(prefixes.exports, iris.exports, literals.exports, classes.exports);
    ts.push(TS.defaultExportsToTS(defaultExports));
  }

  return await TS.formatTS(ts.join('\n'));
}
