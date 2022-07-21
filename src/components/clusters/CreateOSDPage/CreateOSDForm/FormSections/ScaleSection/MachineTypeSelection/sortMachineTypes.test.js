import sortMachineTypes from './sortMachineTypes';

const awsMachineTypes = [
  {
    id: 'g4dn.12xlarge',
    category: 'accelerated_computing',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '48',
    },
  },
  {
    id: 'g4dn.2xlarge',
    category: 'accelerated_computing',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'c5.2xlarge',
    category: 'compute_optimized',
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
    category: 'compute_optimized',
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
    category: 'general_purpose',
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
    category: 'general_purpose',
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
    category: 'general_purpose',
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
    category: 'memory_optimized',
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
    category: 'memory_optimized',
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
    category: 'memory_optimized',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '4',
    },
  },
];

const gcpMachineTypes = [
  {
    id: 'm1-ultramem-40',
    category: 'memory_optimized',
    memory: {
      value: 961 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '40',
    },
  },
  {
    id: 'm1-ultramem-80',
    category: 'memory_optimized',
    memory: {
      value: 1922 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '80',
    },
  },
  {
    id: 'c2-standard-8',
    category: 'compute_optimized',
    memory: {
      value: 32 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'c2-standard-16',
    category: 'compute_optimized',
    memory: {
      value: 64 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '16',
    },
  },
  {
    id: 'c2-standard-4',
    category: 'compute_optimized',
    memory: {
      value: 16 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '4',
    },
  },
  {
    id: 'n1-standard-2',
    category: 'general_purpose',
    memory: {
      value: 7.5 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '2',
    },
  },
  {
    id: 'n1-standard-8',
    category: 'general_purpose',
    memory: {
      value: 30 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '8',
    },
  },
  {
    id: 'n1-standard-1',
    category: 'general_purpose',
    memory: {
      value: 3.75 * 1024 * 1024 * 1024,
      unit: 'B',
    },
    cpu: {
      value: '1',
    },
  },
];

const state = {
  machineTypes: {
    types: {
      aws: awsMachineTypes,
      gcp: gcpMachineTypes,
    },
  },
};

describe('sort machine type', () => {
  it('sorts correctly for aws', () => {
    const sorted = sortMachineTypes(state.machineTypes, 'aws');
    expect(sorted.map(e => e.id)).toEqual([
      'm5.xlarge',
      'm5.2xlarge',
      'm5.4xlarge',
      'r5.xlarge',
      'r5.2xlarge',
      'r5.4xlarge',
      'c5.2xlarge',
      'c5.4xlarge',
      'g4dn.2xlarge',
      'g4dn.12xlarge',
    ]);
  });
  it('sorts correctly for gcp', () => {
    const sorted = sortMachineTypes(state.machineTypes, 'gcp');
    expect(sorted.map(e => e.id)).toEqual([
      'n1-standard-1',
      'n1-standard-2',
      'n1-standard-8',
      'm1-ultramem-40',
      'm1-ultramem-80',
      'c2-standard-4',
      'c2-standard-8',
      'c2-standard-16',
    ]);
  });
});
