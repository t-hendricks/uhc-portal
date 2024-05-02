import range from 'lodash/range';

import { isMPoolAz, isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { availableNodesFromQuota } from '~/components/clusters/common/quotaSelectors';
import { GlobalState } from '~/redux/store';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';
import {
  CloudProvider,
  Cluster,
  MachinePool,
  MachineType,
  Product,
} from '~/types/clusters_mgmt.v1';

import { clusterBillingModelToRelatedResource } from '../billingModelMapper';
import { QuotaParams } from '../quotaModel';

import { MAX_NODES, MAX_NODES_HCP } from './constants';

export const getIncludedNodes = ({
  isMultiAz,
  isHypershift,
}: {
  isMultiAz: boolean;
  isHypershift: boolean;
}) => {
  if (!isHypershift) {
    return 0;
  }
  return isMultiAz ? 9 : 4;
};

export const buildOptions = ({
  included,
  available,
  isEditingCluster,
  currentNodeCount,
  minNodes,
  increment,
  isHypershift,
}: {
  available: number;
  isEditingCluster: boolean;
  currentNodeCount: number;
  minNodes: number;
  increment: number;
  included: number;
  isHypershift?: boolean;
}) => {
  // no extra node quota = only base cluster size is available
  const optionsAvailable = available > 0 || isEditingCluster;
  let maxValue = isEditingCluster ? available + currentNodeCount : available + included;

  const maxNumberOfNodes = isHypershift ? MAX_NODES_HCP : MAX_NODES;
  if (maxValue > maxNumberOfNodes) {
    maxValue = maxNumberOfNodes;
  }

  if (isHypershift && isEditingCluster && maxValue > MAX_NODES_HCP - currentNodeCount) {
    maxValue = MAX_NODES_HCP - currentNodeCount;
  }

  return optionsAvailable ? range(minNodes, maxValue + 1, increment) : [minNodes];
};

export const getAvailableQuota = ({
  quota,
  isByoc,
  isMultiAz,
  machineTypeId,
  machineTypes,
  cloudProviderID,
  product,
  billingModel,
}: {
  machineTypes: GlobalState['machineTypes'];
  machineTypeId: MachineType['id'];
  isByoc: boolean;
  isMultiAz: boolean;
  quota: GlobalState['userProfile']['organization']['quotaList'];
  cloudProviderID: CloudProvider['id'];
  product: Product['id'];
  billingModel: Cluster['billing_model'];
}) => {
  if (!machineTypeId) {
    return 0;
  }
  const machineTypeResource = machineTypes.typesByID?.[machineTypeId];
  if (!machineTypeResource) {
    return 0;
  }
  const resourceName = machineTypeResource.generic_name;

  const quotaParams: QuotaParams = {
    product,
    cloudProviderID,
    isBYOC: isByoc,
    isMultiAz,
    resourceName,
    billingModel: clusterBillingModelToRelatedResource(billingModel), // TODO: it should handle marketplace-* -> marketplace in future
  };
  return availableNodesFromQuota(quota as QuotaCostList, quotaParams);
};

/**
 * Function to calculate the amount of all the
 * nodes on machine pools for the cluster
 * @param machinePools List of machine pools
 * @param isHypershift Boolean if it is a hypershift cluster
 * @param editMachinePoolId Id of the machine pool being edited
 * @param machineTypeId Id of the machine pool type
 * @returns Total node count on machine pools for the cluster
 */
export const getNodeCount = (
  machinePools: MachinePool[],
  isHypershift: boolean,
  editMachinePoolId: string | undefined,
  machineTypeId: string | undefined,
): number =>
  machinePools.reduce((totalCount: number, mp: MachinePool) => {
    const mpReplicas = (mp.autoscaling ? mp.autoscaling.max_replicas : mp.replicas) || 0;

    if (
      (isHypershift && mp.id !== editMachinePoolId) ||
      (!isHypershift && mp.instance_type === machineTypeId)
    ) {
      return totalCount + mpReplicas;
    }
    return totalCount;
  }, 0);

export type getNodeOptionsType = {
  cluster: Cluster;
  quota: GlobalState['userProfile']['organization']['quotaList'];
  machineTypes: GlobalState['machineTypes'];
  machineTypeId: string | undefined;
  machinePools: MachinePool[];
  machinePool: MachinePool | undefined;
  minNodes: number;
  editMachinePoolId?: string;
};
export const getNodeOptions = ({
  cluster,
  quota,
  machineTypes,
  machineTypeId,
  machinePools,
  machinePool,
  minNodes,
  editMachinePoolId,
}: getNodeOptionsType) => {
  const isMultiAz = isMultiAZ(cluster);

  const isMPoolAZ = isMPoolAz(cluster, machinePool?.availability_zones?.length);

  const available = getAvailableQuota({
    quota,
    machineTypes,
    machineTypeId,
    isMultiAz,
    isByoc: !!cluster.ccs?.enabled,
    cloudProviderID: cluster.cloud_provider?.id,
    billingModel: cluster.billing_model,
    product: cluster.product?.id,
  });

  const isHypershift = isHypershiftCluster(cluster);

  const included = getIncludedNodes({
    isHypershift,
    isMultiAz,
  });

  const currentNodeCount = getNodeCount(
    machinePools,
    isHypershift,
    editMachinePoolId,
    machineTypeId,
  );

  return buildOptions({
    available,
    isEditingCluster: true,
    included,
    currentNodeCount,
    minNodes,
    increment: isMPoolAZ ? 3 : 1,
    isHypershift: isHypershiftCluster(cluster),
  });
};
