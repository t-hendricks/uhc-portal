import get from 'lodash/get';
import mergeWith from 'lodash/mergeWith';

import {
  haveCapabilities,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';

const { SUBSCRIBED_OCP, SUBSCRIBED_OCP_MARKETPLACE } = subscriptionCapabilities;

const canSubscribeOCPListSelector = (state) => {
  const clusters = get(state, 'clusters.clusters.clusters', []);
  const subscribeStandardOCPList = haveCapabilities(clusters, SUBSCRIBED_OCP);
  const subscribeMarketplaceOCPList = haveCapabilities(clusters, SUBSCRIBED_OCP_MARKETPLACE);

  return mergeWith(
    subscribeStandardOCPList,
    subscribeMarketplaceOCPList,
    (objVal, srcVal) => objVal || srcVal,
  );
};

export default canSubscribeOCPListSelector;
