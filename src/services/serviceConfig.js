const authHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('kctoken')}`,
});

const serviceConfig = (passedConfig = {}, auth = true) => Object.assign(
  {
    headers: auth ? authHeader() : {},
  },
  passedConfig,
);

export default serviceConfig;
