import { isHibernating } from '~/components/clusters/common/clusterStates';
import get from 'lodash/get';
import { checkLabels } from '../../../../../common/validators';
import { asArray } from '../../../../../common/helpers';
import { isHypershiftCluster, isMultiAZ } from '../../clusterDetailsHelper';

const NON_CCS_DEFAULT_POOL = 'worker';

const isDeleteDisabled = (canDelete, machinePools, isEnforcedDefaultMP) => {
  const permissionsReason = !canDelete && 'You do not have permissions to delete machine pools';
  const lastNodePoolReason = machinePools.length === 1 && 'The last machine pool cannot be deleted';
  return (
    permissionsReason ||
    lastNodePoolReason ||
    (isEnforcedDefaultMP ? 'Default machine pool cannot be deleted' : undefined)
  );
};

const getActions = ({
  onClickScale,
  onClickDelete,
  onClickEditLabels,
  onClickEditTaints,
  onClickUpdate,
  deleteDisabledReason,
  taintsDisabledReason,
}) => {
  const scaleAction = {
    title: 'Scale',
    onClick: onClickScale,
    className: 'hand-pointer',
  };

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
    isAriaDisabled: !!deleteDisabledReason,
    ...(!!deleteDisabledReason && { tooltip: deleteDisabledReason }),
  };

  const editLabelsAction = {
    title: 'Edit labels',
    onClick: onClickEditLabels,
    className: 'hand-pointer',
  };

  const editTaintsAction = {
    title: 'Edit taints',
    onClick: onClickEditTaints,
    className: 'hand-pointer',
    isAriaDisabled: !!taintsDisabledReason,
    ...(!!taintsDisabledReason && { tooltip: taintsDisabledReason }),
  };

  const updateAction = {
    title: 'Update version',
    onClick: onClickUpdate,
    className: 'hand-pointer',
  };

  return {
    scaleAction,
    deleteAction,
    editLabelsAction,
    editTaintsAction,
    updateAction,
  };
};

const actionResolver = ({
  rowData,
  canDelete,
  cluster,
  machinePools,
  onClickUpdate,
  machineTypes,
  ...rest
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

  const actions = getActions({
    ...rest,
    onClickUpdate,
    deleteDisabledReason: isDeleteDisabled(canDelete, machinePools, isEnforcedDefaultMP),
    taintsDisabledReason: isEnforcedDefaultMP
      ? 'Default machine pool cannot have taints'
      : undefined,
  });

  return [
    actions.scaleAction,
    actions.editLabelsAction,
    actions.editTaintsAction,
    actions.deleteAction,
    ...(onClickUpdate !== undefined ? [actions.updateAction] : []),
  ];
};

const findDuplicateKey = (labels) => {
  const keys = {};
  let duplicateKey = null;
  labels.forEach((tag) => {
    const labelParts = tag.split('=');
    const labelKey = labelParts[0];
    if (keys[labelKey]) {
      duplicateKey = labelKey;
    } else {
      keys[labelKey] = true;
    }
  });
  return duplicateKey;
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

const validateDuplicateLabels = (labels) => {
  const duplicateKey = findDuplicateKey(labels);
  if (duplicateKey) {
    return `Each label should have a unique key. "${duplicateKey}" already exists.`;
  }
  return undefined;
};

// Takes a node_pool format (singular min/max replica) and converts machine pool style of data (plural min/max replicas)
const normalizeNodePool = (nodePool) => {
  if (nodePool.autoscaling) {
    const normalizedNodePool = { ...nodePool, autoscaling: { ...nodePool.autoscaling } };
    if (nodePool.autoscaling.min_replica >= 0) {
      normalizedNodePool.autoscaling.min_replicas = nodePool.autoscaling.min_replica;
      delete normalizedNodePool.autoscaling.min_replica;
    }
    if (nodePool.autoscaling.max_replica >= 0) {
      normalizedNodePool.autoscaling.max_replicas = nodePool.autoscaling.max_replica;
      delete normalizedNodePool.autoscaling.max_replica;
    }
    return normalizedNodePool;
  }
  return nodePool;
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

/**
 * Node increment
 * MultiAz requires nodes to be a multiple of 3
 * @param {boolean} isMultiAz
 * @returns number
 */
const getNodeIncrement = (isMultiAz) => (isMultiAz ? 3 : 1);

/**
 * Minimum is 2, and if more than 1 node pool, then minimum is num of pools
 * @param {number} numMachinePools
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
  return numMachinePools;
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
  if (isHibernating(cluster.state)) {
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

export {
  parseTags,
  parseLabels,
  actionResolver,
  validateDuplicateLabels,
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
};
