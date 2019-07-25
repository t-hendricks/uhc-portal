import sortMachineTypes from './sortMachineTypes';

const machineTypes = [
  {
    id: 'c5.2xlarge',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'c5.4xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'm5.2xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'm5.4xlarge',
    memory: {
      value: 64 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'm5.xlarge',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'r5.2xlarge',
    memory: {
      value: 64 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'r5.4xlarge',
    memory: {
      value: 128 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
  {
    id: 'r5.xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
  },
];

describe('categorySort', () => {
  it('sorts correctly', () => {
    machineTypes.sort(sortMachineTypes);
    expect(machineTypes.map(e => e.id)).toEqual([
      'm5.xlarge',
      'm5.2xlarge',
      'm5.4xlarge',
      'r5.xlarge',
      'r5.2xlarge',
      'r5.4xlarge',
      'c5.2xlarge',
      'c5.4xlarge',
    ]);
  });
});
