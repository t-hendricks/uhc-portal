import get from 'lodash/get';


const canSubscribeOCPSelector = (state) => {
  const capabilites = get(state, 'clusters.details.cluster.subscription.capabilities', []);
  const subscribeOCP = capabilites.find(capability => capability.name === 'capability.cluster.subscribed_ocp');

  return !!(subscribeOCP && subscribeOCP.value === 'true');
};

export default canSubscribeOCPSelector;
