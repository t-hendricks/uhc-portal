import axios from 'axios';

import config from '../config';
import { Graph } from '../types/upgrades_info.v1';

const getOCPReleaseChannel = (channel: string) =>
  axios.get<Graph>('/api/upgrades_info/v1/graph', {
    baseURL: config.configData.apiGateway,
    headers: {
      Accept: 'application/json',
    },
    params: {
      channel,
      arch: 'amd64',
    },
  });

export default getOCPReleaseChannel;
