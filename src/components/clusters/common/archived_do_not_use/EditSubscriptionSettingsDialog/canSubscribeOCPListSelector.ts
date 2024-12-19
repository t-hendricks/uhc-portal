import mergeWith from 'lodash/mergeWith';

import { GlobalState } from '~/redux/store';
import { ClusterWithPermissions } from '~/types/types';

import {
  haveCapabilities,
  subscriptionCapabilities,
} from '../../../../../common/subscriptionCapabilities';

// TODO this can be removed once clusters.clusters.clusters has been removed from Redux
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

export const canSubscribeOCPListFromClusters = (clusters: ClusterWithPermissions[] = []) => {
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
