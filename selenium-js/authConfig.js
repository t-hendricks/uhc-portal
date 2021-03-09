const config = {
  qaAuth: {
    username: 'ealfassa',
    password: 'redhat',
    urlPrefix: 'https://qa.foo.redhat.com:1337/openshift/',
  },
  prodAuth: {
    username: process.env.TEST_SELENIUM_WITHQUOTA_USER,
    password: process.env.TEST_SELENIUM_WITHQUOTA_PASSWORD,
    urlPrefix: 'https://prod.foo.redhat.com:1337/openshift/',
  },
};
const getAuthConfig = () => {
  if (process.env.TEST_SELENIUM_WITHQUOTA_USER
      && process.env.TEST_SELENIUM_WITHQUOTA_PASSWORD) {
    // have prod credentials - use prod auth
    return config.prodAuth;
  }
  return config.qaAuth;
};

exports.getAuthConfig = getAuthConfig;
