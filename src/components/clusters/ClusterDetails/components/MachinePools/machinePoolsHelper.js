
const actionResolver = (rowData, onClickDelete, onClickScale) => {
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

  return [
    {
      title: 'Scale',
      onClick: onClickScale,
      className: 'hand-pointer',
    },
    ...deleteAction,
  ];
};


export default actionResolver;
