import config from '../config';

const authHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('kctoken')}`,
});

const serviceConfig = (passedConfig = {}, auth = true) => {
  let BASE_URL = config.configData.apiGateway ? config.configData.apiGateway : '';
  return Object.assign(
    {},
    passedConfig,
    {
      headers: auth ? authHeader() : {},

      // NOTE: If running using webpack-server development server, and setting env
      // variable `GATEWAY_DOMAIN` to a development api server, we can test that
      // api server without editing the `config.json` file.
      url: process.env.UHC_GATEWAY_DOMAIN
        ? `${process.env.UHC_GATEWAY_DOMAIN}${passedConfig.url}`
        : `${BASE_URL}${passedConfig.url}`,
    },
  );
};

export default serviceConfig;
