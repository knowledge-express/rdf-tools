import * as jsonFormat from 'json-format';

export const formatterOptions = {
  type: 'space',
  size: 2
};

export function formatLD(ld: Object, options: typeof formatterOptions = formatterOptions): string {
   return jsonFormat(ld, options);
}
