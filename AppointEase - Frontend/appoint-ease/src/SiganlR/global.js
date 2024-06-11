const DEFAULTS = {
  enabled: true
};

export let defaultOptions = DEFAULTS;

export const setDefaults = (options) => {
  defaultOptions = {
    ...DEFAULTS,
    ...options
  };
};
