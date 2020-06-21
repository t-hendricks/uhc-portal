import axios from 'axios';
import * as Sentry from '@sentry/browser';

import config from '../config';

const authInterceptor = (client) => {
  client.interceptors.request.use(async (cfg) => {
    await insights.chrome.auth.getUser();
    const token = await insights.chrome.auth.getToken();
    const BASE_URL = cfg.baseURL || (config.configData.apiGateway ? config.configData.apiGateway : '');
    const updatedCfg = { ...cfg, url: `${BASE_URL}${cfg.url}` };
    if (token) {
      updatedCfg.headers = {
        ...updatedCfg.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      Sentry.withScope((scope) => {
        scope.setFingerprint(['empty token']); // group all "empty token" errors together
        Sentry.captureException(new Error('Got empty token from Insights'));
      });
    }
    delete updatedCfg.customHost;
    return updatedCfg;
  });
  return client;
};

const apiRequest = authInterceptor(axios.create());

export default apiRequest;
