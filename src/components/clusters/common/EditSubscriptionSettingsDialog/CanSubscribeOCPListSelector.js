import get from 'lodash/get';


const canSubscribeOCPListSelector = (state) => {
  const clusters = get(state, 'clusters.clusters.clusters', []);

  const subscribeOCPList = {};
  clusters.forEach((cluster) => {
    const capabilites = get(cluster, 'subscription.capabilities', []);
    const subscribeOCP = capabilites.find(capability => capability.name === 'capability.cluster.subscribed_ocp');
    subscribeOCPList[cluster.id] = !!(subscribeOCP && subscribeOCP.value === 'true');
  });

  return subscribeOCPList;
};

export default canSubscribeOCPListSelector;
