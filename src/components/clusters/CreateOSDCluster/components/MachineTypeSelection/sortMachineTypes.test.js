import sortMachineTypes from './sortMachineTypes';

const awsMachineTypes = [
  {
    id: 'c5.2xlarge',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'c5.4xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '16',
    },
  },
  {
    id: 'm5.2xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'm5.4xlarge',
    memory: {
      value: 64 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '16',
    },
  },
  {
    id: 'm5.xlarge',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '4',
    },
  },
  {
    id: 'r5.2xlarge',
    memory: {
      value: 64 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'r5.4xlarge',
    memory: {
      value: 128 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '16',
    },
  },
  {
    id: 'r5.xlarge',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '4',
    },
  },
];

describe('sort machine type', () => {
  it('sorts correctly for aws', () => {
    const sorted = sortMachineTypes({ machineTypes: { types: { aws: awsMachineTypes } } }, 'aws');
    expect(sorted.map(e => e.id)).toEqual([
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
