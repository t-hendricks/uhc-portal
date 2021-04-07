
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
  return (labelParts.length === 2 && labelParts[0] !== '' && labelParts[1] !== '');
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
    return 'Each label should be in the form of "key=value".';
  }
  return undefined;
};

export {
  actionResolver, parseLabels, parseTags, validateLabels,
};
