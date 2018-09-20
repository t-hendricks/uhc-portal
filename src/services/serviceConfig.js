import config from '../config';

const authHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('kctoken')}`,
});

const serviceConfig = (passedConfig = {}, auth = true) => Object.assign(
  {},
  passedConfig,
  {
    headers: auth ? authHeader() : {},
    url: `${config.configData.apiGateway}/${passedConfig.url}`,
  },
);

export default serviceConfig;
