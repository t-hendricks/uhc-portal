import axios from 'axios';
import * as Sentry from '@sentry/browser';

import config from '../config';

export const authInterceptor = (client) => {
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
      setTimeout(() => {
        /* this is in a timeout to give Insights a chance to redirect
         if the token is expired, before we report it as an error.
         The assumption is that if Insights is trying to redirect, it might happen asynchronously,
         so we should wait a bit before reporting this error, assuming once a redirect happens
         our code will stop running and this timer won't be reached */
        Sentry.withScope((scope) => {
          scope.setFingerprint(['empty token']); // group all "empty token" errors together
          Sentry.captureException(new Error('Got empty token from Insights'));
        });
      }, 15000);
    }
    delete updatedCfg.customHost;
    return updatedCfg;
  });
  return client;
};

const apiRequest = authInterceptor(axios.create());

export default apiRequest;
