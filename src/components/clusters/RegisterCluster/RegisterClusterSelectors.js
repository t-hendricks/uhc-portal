import get from 'lodash/get';

const hasOrgLevelsubscribeOCPCapability = (state) => {
  const capabilites = get(state, 'userProfile.organization.details.capabilities', []);
  const subscribeOCP = capabilites.find(
    (capability) => capability.name === 'capability.cluster.subscribed_ocp',
  );

  return !!(subscribeOCP && subscribeOCP.value === 'true');
};

export default hasOrgLevelsubscribeOCPCapability;
