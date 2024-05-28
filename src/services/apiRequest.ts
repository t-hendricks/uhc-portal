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

const apiRequestCache: { [baseURL: string]: AxiosInstance } = {};

export function getAPIRequest(baseURL: string) {
  if (!apiRequestCache[baseURL]) {
    const apiRequest = authInterceptor(axios.create());
    apiRequest.defaults.baseURL = baseURL;
    apiRequestCache[baseURL] = apiRequest;
  }
  return apiRequestCache[baseURL];
}

export function getAPIRequestForRegion(region?: string) {
  return region && config.configData.apiRegionalGatewayTemplate
    ? getAPIRequest(config.configData.apiRegionalGatewayTemplate.replace('$REGION$', region))
    : apiRequest;
}

export type APIRequest = typeof apiRequest;
export default apiRequest;
