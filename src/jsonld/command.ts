import * as Model from '../model';
import * as Helpers from '../helpers';
import * as LD from '.';

export type LD = {
  '@context'?: Object
}

export async function handleCommand(glob: string, config: LD.Config) {
  if (glob == null) throw new Error('You must enter a glob pattern.');
  const ontology = await Helpers.getOntology(glob);

  let ld: LD = {};

  if (config.context) {
    const { iris } = await Model.getIRIs(ontology);
    ld['@context'] = LD.getContext(iris);
  }

  return LD.formatLD(ld);
}
