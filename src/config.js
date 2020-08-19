const ENV_OVERRIDE_LOCALSTORAGE_KEY = 'ocmOverridenEnvironment';
const configs = {};

// Specify configs to load below. The `webpackMode` comments are to ensure configs
// get bundled in the main chunk, and not spilt to tiny chunks

configs.production = import(/* webpackMode: "eager" */ './config/production.json');
if (APP_BETA || APP_DEVMODE || APP_API_ENV !== 'production') {
  configs.staging = import(/* webpackMode: "eager" */ './config/staging.json');
  configs.integration = import(/* webpackMode: "eager" */ './config/integration.json');
  configs.ci = import(/* webpackMode: "eager" */ './config/ci.json');
}
if (APP_DEV_SERVER) {
  // running in webpack dev server, default to development config
  configs.development = import(/* webpackMode: "eager" */ './config/development.json');
  configs.default = configs.development;
} else {
  // running in a real build, select config according to the APP_API_ENV flag
  configs.default = configs[APP_API_ENV];
}

const parseEnvQueryParam = () => {
  let ret;
  window.location.search.substring(1).split('&').forEach((queryString) => {
    const [key, val] = queryString.split('=');
    if (key === 'env' && !!configs[val]) {
      ret = val;
    }
  });
  return ret;
};


const config = {
  configData: {},
  override: false,
  fetchConfig() {
    const that = this;
    return new Promise((resolve) => {
      const queryEnv = parseEnvQueryParam() || localStorage.getItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
      if (queryEnv && configs[queryEnv]) {
        configs[queryEnv].then((data) => {
          that.configData = data;
          that.override = queryEnv;
          localStorage.setItem(ENV_OVERRIDE_LOCALSTORAGE_KEY, queryEnv);
          resolve();
        });
      } else {
        configs.default.then((data) => {
          that.configData = data;
          resolve();
        });
      }
    });
  },
};

export { ENV_OVERRIDE_LOCALSTORAGE_KEY };
export default config;
