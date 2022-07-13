import { checkLabels } from '../../../../../common/validators';

const actionResolver = (rowData,
  onClickDelete,
  onClickScale,
  onClickEditTaints,
  onClickEditLaebls) => {
  // hide actions kebab for expandable rows
  if (!rowData.machinePool) {
    return [];
  }

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
  };

  const editLabelsAction = {
    title: 'Edit labels',
    onClick: onClickEditLaebls,
    className: 'hand-pointer',
  };

  const editTaintsAction = {
    title: 'Edit taints',
    onClick: onClickEditTaints,
    className: 'hand-pointer',
  };

  const additionalMachinePoolActions = [
    editLabelsAction,
    editTaintsAction,
    deleteAction,
  ];

  return [
    {
      title: 'Scale',
      onClick: onClickScale,
      className: 'hand-pointer',
    },
    ...(rowData.machinePool?.id !== 'Default' ? additionalMachinePoolActions : []),
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

const parseLabels = labelsObj => (labelsObj ? Object.keys(labelsObj).map(labelKey => `${labelKey}=${labelsObj[labelKey]}`) : []);

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

export {
  parseTags,
  parseLabels,
  actionResolver,
  validateDuplicateLabels,
};
