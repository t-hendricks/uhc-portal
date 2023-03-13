import { checkLabels } from '../../../../../common/validators';

const actionResolver = (
  rowData,
  onClickDelete,
  onClickScale,
  onClickEditTaints,
  onClickEditLaebls,
  isHypershift,
  machinePoolsCount,
) => {
  // hide actions kebab for expandable rows
  if (!rowData.machinePool) {
    return [];
  }

  const deleteDisabled = isHypershift && machinePoolsCount === 1;

  const hypershiftTooltip = {
    scale: { tooltip: 'Scaling machine pools is currently only available using ROSA CLI' },
    delete: { tooltip: 'The last machine pool cannot be deleted' },
    edit: { tooltip: 'Editing machine pools is currently only available using ROSA CLI' },
  };

  const scaleAction = {
    title: 'Scale',
    onClick: onClickScale,
    className: 'hand-pointer',
    isAriaDisabled: isHypershift,
    ...(isHypershift && hypershiftTooltip.scale),
  };

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
    isAriaDisabled: deleteDisabled,
    ...(deleteDisabled && hypershiftTooltip.delete),
  };

  const editLabelsAction = {
    title: 'Edit labels',
    onClick: onClickEditLaebls,
    className: 'hand-pointer',
    isAriaDisabled: isHypershift,
    ...(isHypershift && hypershiftTooltip.edit),
  };

  const editTaintsAction = {
    title: 'Edit taints',
    onClick: onClickEditTaints,
    className: 'hand-pointer',
    isAriaDisabled: isHypershift,
    ...(isHypershift && hypershiftTooltip.edit),
  };

  return [
    scaleAction,
    ...(rowData.machinePool?.id !== 'Default'
      ? [editLabelsAction, editTaintsAction, deleteAction]
      : []),
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
  labelsObj ? Object.keys(labelsObj).map((labelKey) => `${labelKey}=${labelsObj[labelKey]}`) : [];

const parseTags = (tags) => {
  const labels = {};
  tags.forEach((tag) => {
    if (!checkLabels(tag)) {
      const labelParts = tag.split('=');
      const labelKey = labelParts[0];
      const labelValue = labelParts[1];
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

export { parseTags, parseLabels, actionResolver, validateDuplicateLabels, normalizeNodePool };
