import get from 'lodash/get';

import { billingModels } from '~/common/subscriptionTypes';
import { QuotaParams } from '~/components/clusters/common/quotaModel';
import { OrganizationState } from '~/redux/reducers/userReducer';
import { PromiseReducerState } from '~/redux/types';
import { Organization, QuotaCostList, RelatedResource } from '~/types/accounts_mgmt.v1';
import { MachineType } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { availableNodesFromQuota } from '../../../common/quotaSelectors';

const hasNodesQuotaForType = <E extends ClusterFromSubscription>(
  machineType: MachineType,
  cluster: E,
  cloudProviderID: string,
  // eslint-disable-next-line camelcase
  billingModel: RelatedResource.billing_model,
  organization: PromiseReducerState<OrganizationState>,
) => {
  const quotaParams: QuotaParams = {
    product: cluster?.subscription?.plan?.type,
    cloudProviderID,
    isBYOC: !!cluster?.ccs?.enabled,
    isMultiAz: cluster.multi_az,
    resourceName: machineType.generic_name,
    billingModel,
  };

  return availableNodesFromQuota(organization?.quotaList as QuotaCostList, quotaParams) >= 1;
};

const hasMachinePoolsQuotaSelector = <E extends ClusterFromSubscription>(
  organizationState: PromiseReducerState<OrganizationState>,
  cluster: E | undefined,
  machineTypes: { [id: string]: MachineType[] } | undefined,
) => {
  if (!organizationState?.fulfilled) {
    return false;
  }

  const cloudProviderID = cluster?.cloud_provider?.id;
  const billingModel =
    RelatedResource.billing_model[
      get(
        cluster,
        'subscription.cluster_billing_model',
        billingModels.STANDARD,
      ) as keyof typeof RelatedResource.billing_model
    ];

  if (cloudProviderID && machineTypes) {
    const types: MachineType[] = get(machineTypes, cloudProviderID, []);
    return types.some((type) =>
      hasNodesQuotaForType(type, cluster, cloudProviderID, billingModel, organizationState),
    );
  }
  return false;
};

const hasOrgLevelAutoscaleCapability = (organization?: Organization) => {
  const capabilities = organization?.capabilities ?? [];
  const autoScaleClusters = capabilities.find(
    (capability) => capability.name === 'capability.cluster.autoscale_clusters',
  );

  return !!(autoScaleClusters && autoScaleClusters.value === 'true');
};

const hasOrgLevelBypassPIDsLimitCapability = (organization?: Organization) =>
  (organization?.capabilities ?? []).some(
    (capability) =>
      capability.name === 'capability.organization.bypass_pids_limits' &&
      capability.value === 'true',
  );

export {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelAutoscaleCapability,
  hasOrgLevelBypassPIDsLimitCapability,
};
