import get from 'lodash/get';

import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { availableNodesFromQuota } from '../../../common/quotaSelectors';

const hasMachinePoolsQuotaSelector = (state) => {
  const { organization } = state.userProfile;

  if (!organization?.fulfilled) {
    return false;
  }

  const { cluster } = state.clusters.details;
  const cloudProviderID = cluster.cloud_provider?.id;
  const billingModel = get(cluster, 'subscription.cluster_billing_model', billingModels.STANDARD);

  const hasNodesQuotaForType = (machineType) => {
    const resourceName = machineType.generic_name;

    const quotaParams = {
      product: cluster?.subscription?.plan?.type,
      cloudProviderID,
      isBYOC: !!cluster?.ccs?.enabled,
      isMultiAz: cluster.multi_az,
      resourceName,
      billingModel,
    };

    const nodesAvailable = availableNodesFromQuota(organization?.quotaList, quotaParams);

    return nodesAvailable >= 1;
  };

  const types = get(state.machineTypes.types, cloudProviderID, []);
  return types.some((type) => hasNodesQuotaForType(type.id));
};

const hasOrgLevelAutoscaleCapability = (state) => {
  const capabilities = get(state, 'userProfile.organization.details.capabilities', []);
  const autoScaleClusters = capabilities.find(
    (capability) => capability.name === 'capability.cluster.autoscale_clusters',
  );

  return !!(autoScaleClusters && autoScaleClusters.value === 'true');
};

const hasOrgLevelBypassPIDsLimitCapability = (state) => {
  const capabilities = state?.userProfile?.organization?.details?.capabilities ?? [];
  return capabilities.some(
    (capability) =>
      capability.name === 'capability.organization.bypass_pids_limits' &&
      capability.value === 'true',
  );
};

// on the OSD creation page don't check cluster level capability for autoscaling
const canAutoScaleOnCreateSelector = (state, product) =>
  product === normalizedProducts.ROSA ||
  (product === normalizedProducts.OSD && hasOrgLevelAutoscaleCapability(state));

export {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelAutoscaleCapability,
  canAutoScaleOnCreateSelector,
  hasOrgLevelBypassPIDsLimitCapability,
};
