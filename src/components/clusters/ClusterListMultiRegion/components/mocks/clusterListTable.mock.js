export const mockedClusters = [
  {
    id: 'myAWSCluster',
    subscription: {
      display_name: 'myAWSCluster',
      plan: { id: 'ROSA-HyperShift', type: 'ROSA' },
    },

    creation_timestamp: '2024-05-20T20:22:45.089933Z',
    cloud_provider: {
      id: 'aws',
    },

    region: {
      id: 'us-west-2',
    },

    openshift_version: '4.15.7',
    metrics: {
      upgrade: {
        state: '',
      },
    },
    state: 'ready',
  },
  {
    id: 'aCluster',
    subscription: {
      display_name: 'aCluster',

      plan: { id: 'OSD', type: 'OSD' },
    },

    creation_timestamp: '2024-12-25T20:22:45.089933Z',
    cloud_provider: {
      id: 'gcp',
    },
    state: 'installing',
    region: {
      id: 'us-east-1',
    },

    openshift_version: '4.16.8',
    metrics: {
      upgrade: {
        state: '',
      },
    },
  },
  {
    id: 'zCluster',
    subscription: {
      display_name: 'zCluster',

      plan: { id: 'ROSA-HyperShift', type: 'ROSA' },
    },

    creation_timestamp: '2024-04-25T20:22:45.089933Z',
    cloud_provider: {
      id: 'aws',
    },
    state: 'ready',
    region: {
      id: 'aa-my-region',
    },

    openshift_version: '4.15.8',
    metrics: {
      upgrade: {
        state: '',
      },
    },
  },
];
