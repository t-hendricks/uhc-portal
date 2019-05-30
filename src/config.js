import axios from 'axios';
import { getResourcesBase } from './common/getBaseName';

const config = {
  configData: {},
  fetchConfig() {
    return new Promise((resolve) => {
      const that = this;
      const BASE = getResourcesBase();
      axios.get(`${BASE}/config/config.json`).then((response) => {
        that.configData = response.data;
        resolve();
      });
    });
  },
};

export default config;
