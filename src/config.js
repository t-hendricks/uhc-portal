const ENV_OVERRIDE_LOCALSTORAGE_KEY = 'ocmOverridenEnvironment';
const configs = {};

// Specify configs to load below. The `webpackMode` comments are to ensure configs
// get bundled in the main chunk, and not spilt to tiny chunks

configs.production = import(/* webpackMode: "eager" */ './config/production.json');
configs.stageSSO = import(/* webpackMode: "eager" */ './config/ci.json');

const isDevOrStaging = APP_BETA || APP_DEVMODE || APP_API_ENV !== 'production';

if (isDevOrStaging) {
  configs.staging = import(/* webpackMode: "eager" */ './config/staging.json');
  configs.integration = import(/* webpackMode: "eager" */ './config/integration.json');
  configs.integrationV3 = import(/* webpackMode: "eager" */ './config/integrationV3.json');
}

if (APP_DEV_SERVER) {
  // running in webpack dev server, add development config
  configs.development = import(/* webpackMode: "eager" */ './config/development.json');
}

// select config according to the APP_API_ENV flag (see webpack.config.js)
configs.default = configs[APP_API_ENV];

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

const parseFakeQueryParam = () => {
  let ret = false;
  window.location.search.substring(1).split('&').forEach((queryString) => {
    const [key, val] = queryString.split('=');
    if (key === 'fake' && val === 'true') {
      ret = true;
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
      if (parseFakeQueryParam() && isDevOrStaging) {
        that.fakeOSD = true;
      }
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
