import axios from 'axios';

import config from '../config';

const authHeader = token => ({
  Authorization: `Bearer ${token}`,
});

const serviceConfig = (passedConfig = {}, token) => {
  const BASE_URL = config.configData.apiGateway ? config.configData.apiGateway : '';
  return Object.assign(
    {},
    passedConfig,
    {
      headers: token ? authHeader(token) : {},

      // NOTE: If running using webpack-server development server, and setting env
      // variable `GATEWAY_DOMAIN` to a development api server, we can test that
      // api server without editing the `config.json` file.
      url: process.env.UHC_GATEWAY_DOMAIN
        ? `${process.env.UHC_GATEWAY_DOMAIN}${passedConfig.url}`
        : `${BASE_URL}${passedConfig.url}`,
    },
  );
};

const apiRequest = params => insights.chrome.auth.getUser().then(
  () => insights.chrome.auth.getToken().then(
    token => axios(serviceConfig(params, token)),
  ),
);

export default apiRequest;
