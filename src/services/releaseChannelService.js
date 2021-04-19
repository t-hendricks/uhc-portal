import axios from 'axios';

import config from '../config';

const getOCPReleaseChannel = channel => axios.get(
  `${config.configData.apiGateway}/api/upgrades_info/v1/graph`,
  {
    headers: {
      Accept: 'application/json',
    },
    params: {
      channel,
      arch: 'amd64',
    },
  },
);

export default getOCPReleaseChannel;
