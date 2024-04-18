export const initialState = {
  report: {
    data: [],
    meta: {},
    pending: false,
    fulfilled: true,
  },
  sources: {
    meta: {
      count: 0,
    },
    pending: false,
    fulfilled: true,
  },
};

export const initialStateNoMeta = {
  report: {
    data: [],
    meta: {},
    pending: false,
    fulfilled: true,
  },
  sources: {
    pending: false,
    fulfilled: true,
  },
};

export const initialStateNoSources = {
  report: {
    data: [],
    meta: {},
    pending: false,
    fulfilled: true,
  },
};

export const availableState = {
  report: {
    data: [
      {
        clusters: [
          {
            values: [
              {
                cluster: 'a94ea9bc-9e4f-4b91-89c2-c7099ec08427',
                clusters: ['OCP-OnPrem01'],
                cost: {
                  total: {
                    value: 27664.774872,
                    units: 'USD',
                  },
                },
              },
            ],
          },
          {
            values: [
              {
                cluster: 'd37fd94b-f44c-4da7-b6d1-9d8344f7977c',
                clusters: ['DemoCluster4.6-Go'],
                cost: {
                  total: {
                    value: 2378.2362022992506,
                    units: 'USD',
                  },
                },
              },
            ],
          },
          {
            values: [
              {
                cluster: '8a3e59b7-23a8-4ed1-b1cf-afd5afea54b9',
                clusters: ['OpenShift on AWS'],
                cost: {
                  total: {
                    value: 537.552548636,
                    units: 'USD',
                  },
                },
              },
            ],
          },
          {
            values: [
              {
                cluster: 'eb93b259-1369-4f90-88ce-e68c6ba879a9',
                clusters: ['OpenShift on Azure'],
                cost: {
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
    meta: { total: { cost: { total: { value: 200 } } } },
    pending: false,
    fulfilled: true,
  },
  sources: {
    meta: {
      count: 1,
    },
    pending: false,
    fulfilled: true,
  },
};
