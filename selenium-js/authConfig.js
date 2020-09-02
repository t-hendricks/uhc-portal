const config = {
  qaAuth: {
    username: 'ealfassa',
    password: 'redhat',
    urlPrefix: 'https://qa.foo.redhat.com:1337/openshift/',
  },
  prodAuth: {
    username: process.env.TEST_SELENIUM_NOANYQUOTA_USERNAME,
    password: process.env.TEST_SELENIUM_NOANYQUOTA_PASSWORD,
    urlPrefix: 'https://prod.foo.redhat.com:1337/openshift/',
  },
};
const getAuthConfig = () => {
  if (process.env.TEST_SELENIUM_NOANYQUOTA_USERNAME
      && process.env.TEST_SELENIUM_NOANYQUOTA_PASSWORD) {
    // have prod credentials - use prod auth
    return config.prodAuth;
  }
  return config.qaAuth;
};

exports.getAuthConfig = getAuthConfig;
