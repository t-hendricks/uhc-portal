import get from 'lodash/get';

import {
  hasCapability,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';

const { SUBSCRIBED_OCP, SUBSCRIBED_OCP_MARKETPLACE } = subscriptionCapabilities;

const canSubscribeOCPSelector = (state) => {
  const sub = get(state, 'clusters.details.cluster.subscription', null);

  return hasCapability(sub, SUBSCRIBED_OCP) || hasCapability(sub, SUBSCRIBED_OCP_MARKETPLACE);
};

// Handles canSubscribeOCP for usecase with React Query
// Eventually should replace canSubscribeOCPSelector
export const canSubscribeOCPMultiRegion = (cluster) => {
  const sub = cluster?.subscription || {};

  return hasCapability(sub, SUBSCRIBED_OCP) || hasCapability(sub, SUBSCRIBED_OCP_MARKETPLACE);
};

export default canSubscribeOCPSelector;
