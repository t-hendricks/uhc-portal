import get from 'lodash/get';

const canEnableEtcdSelector = (state) => {
  const capabilites = get(state, 'userProfile.organization.details.capabilities', []);
  const canEnableEtcd = capabilites.find(capability => capability.name === 'capability.account.allow_etcd_encryption');

  return !!(canEnableEtcd && canEnableEtcd.value === 'true');
};

export default canEnableEtcdSelector;
