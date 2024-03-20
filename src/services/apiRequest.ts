import type { AxiosInstance } from 'axios';
import axios, { InternalAxiosRequestConfig, RawAxiosRequestConfig } from 'axios';
import { getRestrictedEnvApi, isRestrictedEnv } from '~/restrictedEnv';

import config from '../config';

const getBaseUrl = (baseUrl: string | undefined) => {
  if (isRestrictedEnv()) {
    return getRestrictedEnvApi();
  }
  return baseUrl || (config.configData.apiGateway ? config.configData.apiGateway : '');
};

export const authInterceptor = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use(async (cfg) => {
    const BASE_URL = getBaseUrl(cfg.baseURL);
    const updatedCfg: RawAxiosRequestConfig = {
      ...cfg,
      url: `${BASE_URL}${cfg.url}`,
    };
    // @ts-ignore
    delete updatedCfg.customHost;
    return updatedCfg as InternalAxiosRequestConfig;
  });
  return client;
};

const apiRequest = authInterceptor(axios.create());

export default apiRequest;
