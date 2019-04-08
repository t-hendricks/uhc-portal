import axios from 'axios';

const config = {
  configData: {},
  fetchConfig() {
    return new Promise((resolve) => {
      const that = this;
      const BASE = APP_EMBEDDED ? '/apps/openshift' : '/clusters';
      axios.get(`${BASE}/config/config.json`).then((response) => {
        that.configData = response.data;
        resolve();
      });
    });
  },
};

export default config;
