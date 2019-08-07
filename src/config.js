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

        // Environment overrides
        if (response.data.environments) {
          window.location.search.substring(1).split('&').forEach((queryString) => {
            const [key, val] = queryString.split('=');
            if (key === 'env' && !!response.data.environments[val]) {
              // Override global configuration with data from configured environment
              Object.keys(response.data.environments[val]).forEach((override) => {
                that.configData[override] = response.data.environments[val][override];
              });

              // Mark as overridden
              that.configData.overrideEnvironment = true;
            }
          });

          // Remove data from unused environments
          delete that.configData.environments;
        }

        resolve();
      });
    });
  },
};

export default config;
