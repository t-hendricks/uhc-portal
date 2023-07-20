const ENV_OVERRIDE_LOCALSTORAGE_KEY = 'ocmOverridenEnvironment';

type EnvConfig = {
  apiGateway: string;
  insightsGateway?: string;
  sentryDSN?: string;
  showOldMetrics?: boolean;
  fedrampGateway?: string;
  fedrampS3?: string;
};

const configs: { [env: string]: Promise<EnvConfig> | undefined } = {};

// Specify configs to load below. The `webpackMode` comments are to ensure configs
// get bundled in the main chunk, and not spilt to tiny chunks

configs.production = import(/* webpackMode: "eager" */ './config/production.json');
configs.stageSSO = import(/* webpackMode: "eager" */ './config/ci.json');
configs.staging = import(/* webpackMode: "eager" */ './config/staging.json');
configs.integration = import(/* webpackMode: "eager" */ './config/integration.json');

if (APP_DEV_SERVER) {
  // running in webpack dev server, add development configs
  configs.development = import(/* webpackMode: "eager" */ './config/development.json');
  configs.mockdata = import(/* webpackMode: "eager" */ './config/mockdata.json');
}

// select config according to the APP_API_ENV flag (see webpack.config.js)
configs.default = configs[APP_API_ENV];

const parseEnvQueryParam = (): string | undefined => {
  let ret: string | undefined;
  window.location.search
    .substring(1)
    .split('&')
    .forEach((queryString) => {
      const [key, val] = queryString.split('=');
      if (key === 'env' && !!configs[val]) {
        ret = val;
      } else if (key === 'env' && val === 'mockserver' && configs.mockdata) {
        ret = 'mockdata';
      }
    });
  return ret;
};

const parseFakeQueryParam = () => {
  let ret = false;
  window.location.search
    .substring(1)
    .split('&')
    .forEach((queryString) => {
      const [key, val] = queryString.split('=');
      if (key === 'fake' && val === 'true') {
        ret = true;
      }
    });
  return ret;
};

const config = {
  configData: {} as EnvConfig,
  envOverride: undefined as string | undefined,
  fakeOSD: false,

  loadConfig(data: EnvConfig) {
    this.configData = {
      ...data,
      // replace $SELF_PATH$ with the current host
      // to avoid CORS issues when not using prod.foo
      apiGateway: data.apiGateway.replace('$SELF_PATH$', window.location.host),
      insightsGateway:
        data.insightsGateway?.replace('$SELF_PATH$', window.location.host) || undefined,
    };

    // make config available in browser devtools for debugging
    (window as any).ocmConfig = this;
  },

  fetchConfig() {
    const that = this;
    return new Promise<void>((resolve) => {
      if (parseFakeQueryParam()) {
        that.fakeOSD = true;
      }
      const queryEnv = parseEnvQueryParam() || localStorage.getItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
      if (queryEnv && configs[queryEnv]) {
        configs[queryEnv]!.then((data) => {
          this.loadConfig(data);
          // eslint-disable-next-line no-console
          console.info(`Loaded override config: ${queryEnv}`);
          that.envOverride = queryEnv;
          localStorage.setItem(ENV_OVERRIDE_LOCALSTORAGE_KEY, queryEnv);
          resolve();
        });
      } else {
        configs.default?.then((data) => {
          this.loadConfig(data);
          // eslint-disable-next-line no-console
          console.info(`Loaded default config: ${APP_API_ENV}`);
          resolve();
        });
      }
    });
  },
};

export { ENV_OVERRIDE_LOCALSTORAGE_KEY };
export default config;
