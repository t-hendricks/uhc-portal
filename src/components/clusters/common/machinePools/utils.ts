import range from 'lodash/range';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { availableNodesFromQuota } from '~/components/clusters/common/quotaSelectors';
import { GlobalState } from '~/redux/store';
import {
  CloudProvider,
  Cluster,
  MachinePool,
  MachineType,
  Product,
} from '~/types/clusters_mgmt.v1';
import { MAX_NODES } from './constants';

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
}: {
  available: number;
  isEditingCluster: boolean;
  currentNodeCount: number;
  minNodes: number;
  increment: number;
  included: number;
}) => {
  // no extra node quota = only base cluster size is available
  const optionsAvailable = available > 0 || isEditingCluster;
  let maxValue = isEditingCluster ? available + currentNodeCount : available + included;
  if (maxValue > MAX_NODES) {
    maxValue = MAX_NODES;
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

  const quotaParams = {
    product,
    cloudProviderID,
    isBYOC: isByoc,
    isMultiAz,
    resourceName,
    billingModel,
  };
  return availableNodesFromQuota(quota || {}, quotaParams);
};

export const getNodeOptions = ({
  cluster,
  quota,
  machineTypes,
  machineTypeId,
  machinePools,
  minNodes,
}: {
  cluster: Cluster;
  quota: GlobalState['userProfile']['organization']['quotaList'];
  machineTypes: GlobalState['machineTypes'];
  machineTypeId: string | undefined;
  machinePools: MachinePool[];
  minNodes: number;
}) => {
  const isMultiAz = isMultiAZ(cluster);

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

  const included = getIncludedNodes({
    isHypershift: isHypershiftCluster(cluster),
    isMultiAz,
  });

  const currentNodeCount = machinePools.reduce((acc, mp) => {
    if (mp.instance_type === machineTypeId) {
      return acc + ((mp.autoscaling ? mp.autoscaling.max_replicas : mp.replicas) || 0);
    }
    return acc;
  }, 0);

  return buildOptions({
    available,
    isEditingCluster: true,
    included,
    currentNodeCount,
    minNodes,
    increment: isMultiAz ? 3 : 1,
  });
};
