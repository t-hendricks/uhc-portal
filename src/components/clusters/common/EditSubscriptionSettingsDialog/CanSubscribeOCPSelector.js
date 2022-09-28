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

export default canSubscribeOCPSelector;
