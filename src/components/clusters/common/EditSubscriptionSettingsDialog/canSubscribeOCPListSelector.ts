import mergeWith from 'lodash/mergeWith';

import { GlobalState } from '~/redux/store';

import {
  haveCapabilities,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';

const canSubscribeOCPListSelector = (state: GlobalState) => {
  const clusters = state?.clusters?.clusters?.clusters ?? [];

  const subscribeStandardOCPList = haveCapabilities(
    clusters,
    subscriptionCapabilities.SUBSCRIBED_OCP,
  );
  const subscribeMarketplaceOCPList = haveCapabilities(
    clusters,
    subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE,
  );

  return mergeWith(
    subscribeStandardOCPList,
    subscribeMarketplaceOCPList,
    (objVal, srcVal) => objVal || srcVal,
  );
};

export default canSubscribeOCPListSelector;
