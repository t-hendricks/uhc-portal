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
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 39787.5631884,
                    units: 'USD',
                  },
                  total: {
                    value: 39787.5631884,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 39787.5631884,
                    units: 'USD',
                  },
                  total: {
                    value: 39787.5631884,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
    meta: {},
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

export const report = {
  ...availableState.report,
  meta: { total: { cost: { total: { value: 10, units: 'EUR' } } } },
};
