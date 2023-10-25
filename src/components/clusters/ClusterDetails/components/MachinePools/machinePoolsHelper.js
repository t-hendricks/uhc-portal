import get from 'lodash/get';
import { isHibernating } from '~/components/clusters/common/clusterStates';
import { normalizeProductID } from '~/common/normalize';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { checkLabels } from '../../../../../common/validators';
import { asArray } from '../../../../../common/helpers';
import { isHypershiftCluster, isMultiAZ } from '../../clusterDetailsHelper';

const NON_CCS_DEFAULT_POOL = 'worker';

const minReplicasNeededText =
  'There needs to be at least 2 nodes without taints across all machine pools';

const isDeleteDisabled = (
  canDelete,
  machinePools,
  isEnforcedDefaultMP,
  isMinimumCountWithoutTaints,
) => {
  const permissionsReason = !canDelete && 'You do not have permissions to delete machine pools';
  const lastNodePoolReason = machinePools.length === 1 && 'The last machine pool cannot be deleted';
  const enforcedDefaultMPReason = isEnforcedDefaultMP && 'Default machine pool cannot be deleted';
  const minimumCountReason = !isMinimumCountWithoutTaints && minReplicasNeededText;
  return (
    permissionsReason ||
    lastNodePoolReason ||
    enforcedDefaultMPReason ||
    minimumCountReason ||
    undefined
  );
};

const actionResolver = ({
  rowData,
  onClickEdit,
  onClickDelete,
  onClickUpdate,
  canDelete,
  cluster,
  machinePools,
  machineTypes,
}) => {
  // hide actions kebab for expandable rows
  if (!rowData.machinePool) {
    return [];
  }
  const isEnforcedDefaultMP = isEnforcedDefaultMachinePool(
    rowData.machinePool.id,
    machinePools,
    machineTypes,
    cluster,
  );

  const hasMinimumCount = isMinimumCountWithoutTaints({
    currentMachinePoolId: rowData.machinePool.id,
    machinePools,
    cluster,
  });

  const deleteDisabledReason = isDeleteDisabled(
    canDelete,
    machinePools,
    isEnforcedDefaultMP,
    hasMinimumCount,
  );

  const editAction = {
    title: 'Edit',
    onClick: onClickEdit,
    className: 'hand-pointer',
  };

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
    isAriaDisabled: !!deleteDisabledReason,
    ...(!!deleteDisabledReason && { tooltip: deleteDisabledReason }),
  };

  const updateAction = {
    title: 'Update version',
    onClick: onClickUpdate,
    className: 'hand-pointer',
  };

  return [editAction, deleteAction, ...(onClickUpdate !== undefined ? [updateAction] : [])];
};

const parseLabels = (labelsObj) =>
  labelsObj
    ? Object.keys(labelsObj).map(
        (labelKey) => `${labelKey}${labelsObj[labelKey] ? '=' : ''}${labelsObj[labelKey]}`,
      )
    : [];

const parseTags = (tags) => {
  const labels = {};
  tags.forEach((tag) => {
    if (!checkLabels(tag)) {
      const labelParts = tag.split('=');
      const labelKey = labelParts[0];
      const labelValue = labelParts[1] ? labelParts[1] : '';
      labels[labelKey] = labelValue;
    }
  });
  return labels;
};

// Takes a node_pool format (singular min/max replica) and converts machine pool style of data (plural min/max replicas)
const normalizeNodePool = (nodePool) => {
  const normalizedNodePool = { ...nodePool, instance_type: nodePool.aws_node_pool?.instance_type };
  if (nodePool.autoscaling) {
    normalizedNodePool.autoscaling = { ...nodePool.autoscaling };
    if (nodePool.autoscaling.min_replica >= 0) {
      normalizedNodePool.autoscaling.min_replicas = nodePool.autoscaling.min_replica;
      delete normalizedNodePool.autoscaling.min_replica;
    }
    if (nodePool.autoscaling.max_replica >= 0) {
      normalizedNodePool.autoscaling.max_replicas = nodePool.autoscaling.max_replica;
      delete normalizedNodePool.autoscaling.max_replica;
    }
  }
  return normalizedNodePool;
};

// Takes a machine pool style of data and makes it match node_pool format (singular min/max replica)
const normalizeMachinePool = (machinePool) => {
  if (machinePool?.autoscaling) {
    const normalizeMachinePool = { ...machinePool };
    normalizeMachinePool.autoscaling = { ...machinePool.autoscaling };
    normalizeMachinePool.autoscaling.min_replica = 0;
    normalizeMachinePool.autoscaling.max_replica = 0;
    if (machinePool.autoscaling?.min_replicas >= 0) {
      normalizeMachinePool.autoscaling.min_replica = machinePool.autoscaling.min_replicas;
      delete normalizeMachinePool.autoscaling.min_replicas;
    }
    if (machinePool.autoscaling?.max_replicas >= 0) {
      normalizeMachinePool.autoscaling.max_replica = machinePool.autoscaling.max_replicas;
      delete normalizeMachinePool.autoscaling.max_replicas;
    }
    return normalizeMachinePool;
  }
  return machinePool;
};

const getSubnetIds = (machinePoolOrNodePool) => {
  // NodePools have "subnet", MachinePools have "subnets"
  const { subnet, subnets } = machinePoolOrNodePool;
  return asArray(subnet || subnets || []);
};

const hasSubnets = (machinePoolOrNodePool) => {
  const subnetIds = getSubnetIds(machinePoolOrNodePool);
  return subnetIds.length > 0;
};

/**
 * Used to determine the minimum nodes allowed during cluster creation,
 * and after when adding new machine pools or editing cluster counts.
 *
 * @param {boolean} isDefaultMachinePool True if it's the default MP
 * @param {boolean} isByoc True if BYOC/CCS cluster, true for ROSA clusters
 * @param {boolean} isMultiAz True if multi-zone
 * @returns number | undefined
 */
const getMinNodesRequired = (isDefaultMachinePool, isByoc, isMultiAz) => {
  if (isDefaultMachinePool) {
    // Default machine pool
    if (isByoc) {
      return isMultiAz ? 3 : 2;
    }
    return isMultiAz ? 9 : 4;
  }

  // Custom machine pool
  return 0;
};

const getClusterMinNodes = ({ cluster, machineTypesResponse, machinePool, machinePools }) => {
  if (isHypershiftCluster(cluster)) {
    return isMinimumCountWithoutTaints({
      currentMachinePoolId: machinePool?.id,
      cluster,
      machinePools,
    })
      ? 1
      : 2;
  }
  const isMultiAz = isMultiAZ(cluster);

  const isEnforcedDefaultMP =
    !!machinePool &&
    isEnforcedDefaultMachinePool(machinePool.id, machinePools, machineTypesResponse, cluster);

  return getMinNodesRequired(isEnforcedDefaultMP, !!cluster?.ccs?.enabled, isMultiAz);
};

/**
 * Node increment
 * MultiAz requires nodes to be a multiple of 3
 * @param {boolean} isMultiAz
 * @returns number
 */
const getNodeIncrement = (isMultiAz) => (isMultiAz ? 3 : 1);

/**
 * Minimum is 2, and if more than 1 node pool, then minimum is num of pools
 * @param {number | undefined=} numMachinePools
 * @returns number
 */
const getMinNodesRequiredHypershift = (numMachinePools) => {
  if (numMachinePools === undefined) {
    // day 2 operation (Add/Edit)
    return 1;
  }
  if (numMachinePools === 1) {
    return 2;
  }
  return numMachinePools || 0;
};

/**
 * Node increment for Hypershift machine pools
 * @returns number
 */
const getNodeIncrementHypershift = (numMachinePools) => {
  if (numMachinePools === undefined) {
    return 1;
  }
  return numMachinePools;
};

const getAddMachinePoolDisabledReason = (cluster) => {
  const isReadOnly = cluster.status?.configuration_mode === 'read_only';
  if (isReadOnly) {
    return 'This operation is not available during maintenance.';
  }
  if (isHibernating(cluster)) {
    return 'This operation is not available while cluster is hibernating.';
  }
  if (!cluster.canEdit) {
    return 'You do not have permission to add a machine pool. Only cluster owners, cluster editors, and Organization Administrators can add machine pools.';
  }
  return undefined;
};

const hasExplicitAutoscalingMachinePool = (machinePools, excludeId) =>
  (machinePools || []).some((mp) => !!mp.autoscaling && (!excludeId || excludeId !== mp.id));

const hasDefaultOrExplicitAutoscalingMachinePool = (cluster, machinePools, excludeId) => {
  const defaultMachineAutoscale = get(cluster, 'nodes.autoscale_compute', false);
  if (defaultMachineAutoscale) {
    return true;
  }
  return hasExplicitAutoscalingMachinePool(machinePools, excludeId);
};

const isEnforcedDefaultMachinePool = (
  currentMachinePoolId,
  machinePools,
  machineTypes,
  cluster,
) => {
  if (isHypershiftCluster(cluster)) {
    return false;
  }

  if (!cluster.ccs?.enabled) {
    return currentMachinePoolId === NON_CCS_DEFAULT_POOL;
  }
  const minimalMachineType = machineTypes.types?.aws?.find((mt) => mt.id === 'm5.xlarge');
  const minReplicas = getMinNodesRequired(true, cluster?.ccs?.enabled, isMultiAZ(cluster));

  const providerMachineTypes =
    cluster.cloud_provider?.id === 'aws' ? machineTypes.types?.aws : machineTypes.types?.gcp;

  return !machinePools
    .filter((mp) => mp.id !== currentMachinePoolId)
    .some((mp) => {
      const instanceType =
        mp.kind === 'NodePool' ? mp.aws_node_pool?.instance_type : mp.instance_type;

      const machineType = providerMachineTypes?.find((mt) => mt.id === instanceType);

      return (
        machineType &&
        !mp.taints &&
        (mp.replicas >= minReplicas || mp.autoscaling?.min_replicas >= minReplicas) &&
        machineType?.cpu?.value >= minimalMachineType?.cpu?.value &&
        machineType?.memory?.value >= minimalMachineType?.memory?.value
      );
    });
};

const isMinimumCountWithoutTaints = ({ currentMachinePoolId, machinePools, cluster }) => {
  if (!isHypershiftCluster(cluster)) {
    return true; // This only applies to HCP clusters
  }

  const numberReplicas = machinePools?.reduce((count, pool) => {
    if (pool.id !== currentMachinePoolId) {
      if (!pool.taints?.length) {
        return count + (pool.autoscaling ? pool.autoscaling.min_replicas : pool.replicas);
      }
    }
    return count;
  }, 0);

  return numberReplicas >= 2;
};

const canUseSpotInstances = (cluster) => {
  const cloudProviderID = cluster.cloud_provider?.id;
  const product = normalizeProductID(cluster.product?.id);
  return (
    cloudProviderID === 'aws' &&
    !isHypershiftCluster(cluster) &&
    (product === normalizedProducts.ROSA ||
      (product === normalizedProducts.OSD && cluster.ccs?.enabled))
  );
};

export {
  parseTags,
  parseLabels,
  actionResolver,
  normalizeNodePool,
  normalizeMachinePool,
  getSubnetIds,
  hasSubnets,
  getMinNodesRequired,
  getNodeIncrement,
  getMinNodesRequiredHypershift,
  getNodeIncrementHypershift,
  getAddMachinePoolDisabledReason,
  hasExplicitAutoscalingMachinePool,
  hasDefaultOrExplicitAutoscalingMachinePool,
  isEnforcedDefaultMachinePool,
  isMinimumCountWithoutTaints,
  minReplicasNeededText,
  canUseSpotInstances,
  getClusterMinNodes,
};
