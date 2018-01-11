const semtools = require('semantic-toolkit');

import { Class, getClasses } from './classes';
import * as Helpers from './helpers';

export async function getTypeGuards(ontology): Promise<{ exports: string[], typeGuards: Array<Class> }> {
  const { classes } =  await getClasses(ontology);
  const typeGuardNames = classes.map(c => Helpers.typeForIris([ c.iri ])).map(Helpers.getTypeGuardName);

  return {
    exports: typeGuardNames,
    typeGuards: classes
  }
}
