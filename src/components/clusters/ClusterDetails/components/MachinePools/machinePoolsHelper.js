
const actionResolver = (rowData, onClickDelete, onClickScale, onClickEditTaints) => {
  // hide actions kebab for expandable rows
  if (!rowData.machinePool) {
    return [];
  }

  const deleteAction = rowData.machinePool?.id !== 'Default'
    ? [{
      title: 'Delete',
      onClick: onClickDelete,
      className: 'hand-pointer',
    }] : [];


  const editTaintsAction = rowData.machinePool?.id !== 'Default'
    ? [{
      title: 'Edit taints',
      onClick: onClickEditTaints,
      className: 'hand-pointer',
    }] : [];

  return [
    {
      title: 'Scale',
      onClick: onClickScale,
      className: 'hand-pointer',
    },
    ...editTaintsAction,
    ...deleteAction,
  ];
};


export default actionResolver;
