import { validateLabelKey, validateLabelValue } from '../../../../../common/validators';

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

const isValidLabel = (label) => {
  const labelParts = label.split('=');
  // label key may NOT be an empty string (label value may be an empty string)
  return (labelParts.length === 2 && labelParts[0] !== ''
    && validateLabelKey(labelParts[0]) === undefined
    && validateLabelValue(labelParts[1]) === undefined);
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
    if (isValidLabel(tag)) {
      const labelParts = tag.split('=');
      const labelKey = labelParts[0];
      const labelValue = labelParts[1];
      labels[labelKey] = labelValue;
    }
  });
  return labels;
};

const validateLabels = (labels) => {
  if (labels.some(label => !(isValidLabel(label)))) {
    return 'Each label should be in the form of "key=value" and each key and value must consist of alphanumeric characters, \' -\', \'_\' or \'.\', and must start and end with an alphanumeric character. A label value may be an empty string';
  }
  const duplicateKey = findDuplicateKey(labels);
  if (duplicateKey) {
    return `Each label should have a unique key. "${duplicateKey}" already exists.`;
  }
  return undefined;
};

export {
  actionResolver, parseLabels, parseTags, validateLabels,
};
