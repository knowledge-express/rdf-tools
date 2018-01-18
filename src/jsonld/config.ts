export const defaultConfig = {
  context: true,
};

export type Config = {
  [P in keyof typeof defaultConfig]?: typeof defaultConfig[P]
};


export function getConfig(config: Config): Config {
  if (Object.keys(defaultConfig).reduce((memo, key) => (memo && !(config[key])), true)) return defaultConfig;
  return config;
}
