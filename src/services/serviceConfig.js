import config from '../config';

const authHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('kctoken')}`,
});

const serviceConfig = (passedConfig = {}, auth = true) => Object.assign(
  {
    headers: auth ? authHeader() : {},
    url: `${config.configData.apiGateway}/${passedConfig.url}`,
  },
  passedConfig,
);

export default serviceConfig;
