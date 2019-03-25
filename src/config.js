import axios from 'axios';

const config = {
  configData: {},
  fetchConfig() {
    return new Promise((resolve) => {
      const that = this;
      axios.get('/clusters/config/config.json').then((response) => {
        that.configData = response.data;
        resolve();
      });
    });
  },
};

export default config;
