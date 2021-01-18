import actionResolver from './machinePoolsHelper';

describe('machine pools action resolver', () => {
  const onClickDelete = jest.fn();
  const onClickScale = jest.fn();

  const scaleAction = {
    title: 'Scale',
    onClick: onClickScale,
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
    expect(actionResolver(expandableRowData, onClickDelete, onClickScale)).toEqual([]);
  });

  it('should not have delete action for the default machine pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['Default', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'Default' },
      key: 'Default',
    };
    const expected = [scaleAction];
    expect(actionResolver(defaultMachinePoolRowData, onClickDelete, onClickScale))
      .toEqual(expected);
  });

  it('should have scale and delete actions', () => {
    const machinePoolRowData = {
      cells: ['test-mp', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'test-mp' },
      key: 'test-mp',
    };
    const expected = [scaleAction, deleteAction];
    expect(actionResolver(machinePoolRowData, onClickDelete, onClickScale))
      .toEqual(expected);
  });
});
