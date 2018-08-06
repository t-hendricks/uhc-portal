
const config = {
  configData: {},
  fetchConfig() {
    return new Promise((resolve, reject) => {
      const that = this;
      fetch('/config/config.json').then(response => response.json()).then((data) => {
        that.configData = data;
        resolve();
      });
    });
  },
};

export default config;
