import { actionResolver, parseLabels, parseTags } from '../machinePoolsHelper';

describe('machine pools action resolver', () => {
  const onClickDelete = jest.fn();
  const onClickScale = jest.fn();
  const onClickTaints = jest.fn();
  const onClickLabels = jest.fn();

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

  const editLabelsAction = {
    title: 'Edit labels',
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
    expect(
      actionResolver(expandableRowData, onClickDelete, onClickScale, onClickTaints, onClickLabels),
    ).toEqual([]);
  });

  it('should only have scale section for the default machine pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['Default', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'Default' },
      key: 'Default',
    };
    const expected = [scaleAction];
    expect(
      actionResolver(
        defaultMachinePoolRowData,
        onClickDelete,
        onClickScale,
        onClickTaints,
        onClickLabels,
      ).toString(),
    ).toEqual(expected.toString());
  });

  it('should have scale, edit taints, edit labels and delete actions', () => {
    const machinePoolRowData = {
      cells: ['test-mp', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'test-mp' },
      key: 'test-mp',
    };
    const expected = [scaleAction, editLabelsAction, editTaintsAction, deleteAction];
    expect(
      actionResolver(
        machinePoolRowData,
        onClickDelete,
        onClickScale,
        onClickTaints,
        onClickLabels,
      ).toString(),
    ).toEqual(expected.toString());
  });
});

describe('parseLabels', () => {
  it('should convert to array properly', () => {
    const labels = { foo: 'bar', hello: 'world' };
    const expected = ['foo=bar', 'hello=world'];
    expect(parseLabels(labels)).toEqual(expected);
  });

  it('should return an empty array when there are no labels', () => {
    expect(parseLabels({})).toEqual([]);
  });
});

describe('parseTags', () => {
  it('should convert to object properly', () => {
    const tags = ['foo=bar', 'hello=world'];
    const expected = { foo: 'bar', hello: 'world' };
    expect(parseTags(tags)).toEqual(expected);
  });

  it('should omit invalid tags', () => {
    const tags = ['foo=bar', 'hello_=world'];
    const expected = { foo: 'bar' };
    expect(parseTags(tags)).toEqual(expected);
  });

  it('should return an empty object when there are no tags', () => {
    expect(parseTags([])).toEqual({});
  });
});
