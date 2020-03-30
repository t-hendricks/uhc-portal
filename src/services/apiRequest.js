import axios from 'axios';

import config from '../config';

const authHeader = token => ({
  Authorization: `Bearer ${token}`,
});

const serviceConfig = (passedConfig = {}, token, customHost) => {
  const BASE_URL = customHost || (config.configData.apiGateway ? config.configData.apiGateway : '');
  return {
    ...passedConfig,
    headers: token ? authHeader(token) : {},
    url: `${BASE_URL}${passedConfig.url}`,
  };
};

const apiRequest = (params, customHost) => insights.chrome.auth.getUser().then(
  () => insights.chrome.auth.getToken().then(
    token => axios(serviceConfig(params, token, customHost)),
  ),
);


export default apiRequest;
