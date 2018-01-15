const semtools = require('semantic-toolkit');

import { Class, getClasses } from './classes';
import * as TS from '../typescript';

export async function getTypeGuards(ontology): Promise<{ exports: string[], typeGuards: Array<Class> }> {
  const { classes } =  await getClasses(ontology);
  const typeGuardNames = classes.map(c => TS.typeForIris([ c.iri ])).map(TS.getTypeGuardName);

  return {
    exports: typeGuardNames,
    typeGuards: classes
  }
}
