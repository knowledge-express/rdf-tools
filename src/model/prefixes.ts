import * as N3 from 'n3';

export async function getPrefixes(ontology): Promise<{ exports: string[], prefixes: { [index: string]: string } }> {
  // Do some inefficient things to get the prefixes
  return (new Promise<{ [index: string]: string }>((resolve, reject) => {
    var prefixes;
    N3.Parser().parse(ontology, (error, triple, p) => {
      if (error) return reject(error);

      // console.log(p);
      prefixes = prefixes ? prefixes : p;

      if (triple === null) return resolve(prefixes);
    });
  })).then(prefixes => {
    if ('' in prefixes) {
      prefixes['$'] = prefixes[''];
      delete prefixes[''];
    }

    return {
      exports: [ 'prefixes' ],
      prefixes,
    }
  });
}
