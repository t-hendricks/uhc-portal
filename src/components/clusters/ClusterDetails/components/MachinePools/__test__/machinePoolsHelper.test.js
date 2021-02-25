import actionResolver from '../machinePoolsHelper';

describe('machine pools action resolver', () => {
  const onClickDelete = jest.fn();
  const onClickScale = jest.fn();
  const onClickTaints = jest.fn();

  const scaleAction = {
    title: 'Scale',
    onClick: onClickScale,
    className: 'hand-pointer',
  };

  const editTaintsAction = {
    title: 'Edit taints',
    onClick: onClickTaints,
    className: 'hand-pointer',
  };

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
  };

  it('should not have actions for an expandable row', () => {
    const expandableRowData = {
      parent: 1,
      cells: [{ title: 'test' }],
      key: 'Default-child',
    };
    expect(actionResolver(
      expandableRowData,
      onClickDelete,
      onClickScale,
      onClickTaints,
    )).toEqual([]);
  });

  it('should only have scale section for the default machine pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['Default', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'Default' },
      key: 'Default',
    };
    const expected = [scaleAction];
    expect(actionResolver(defaultMachinePoolRowData, onClickDelete, onClickScale, onClickTaints))
      .toEqual(expected);
  });

  it('should have scale, edit taints and delete actions', () => {
    const machinePoolRowData = {
      cells: ['test-mp', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'test-mp' },
      key: 'test-mp',
    };
    const expected = [scaleAction, editTaintsAction, deleteAction];
    expect(actionResolver(machinePoolRowData, onClickDelete, onClickScale, onClickTaints))
      .toEqual(expected);
  });
});
