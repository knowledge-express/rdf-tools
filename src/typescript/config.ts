export const defaultConfig = {
  prefixes: true,
  iris: true,
  literals: true,
  classes: true,
  typeGuards: true,
  defaultExports: true,
};

export type Config = {
  [P in keyof typeof defaultConfig]?: typeof defaultConfig[P]
};

export function getConfig(config: Config): Config {
  // if (Object.keys(defaultConfig).reduce((memo, key) => (memo && !(key in config)), true)) return defaultConfig;
  // Default exports is not a valid option by itself, which is why the above statement is not used
  if (!(
    config['prefixes'] || //    in config ||
    config['iris'] || //        in config ||
    // 'literals'    in config ||
    config['classes'] || //     in config ||
    config['typeGuards'] //  in config
  )) return defaultConfig;

  return config;
}
