import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import CostBreakdownCard from './CostBreakdownCard';

const initialState = {
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

const availableState = {
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

describe('<CostBreakdownCard />', () => {
  // let wrapper;
  const getReport = jest.fn();
  const getSources = jest.fn();
  describe('When no source providers are available', () => {
    afterEach(() => {
      getReport.mockClear();
      getSources.mockClear();
    });

    it('is accessible with empty state', async () => {
      const { container } = render(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={initialState.sources}
          report={initialState.report}
        />,
      );
      await checkAccessibility(container);
    });

    it('calls getSources and getReport on mount', () => {
      render(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={initialState.sources}
          report={initialState.report}
        />,
      );
      expect(getSources).toBeCalled();
      expect(getReport).toBeCalled();
    });
  });

  describe('When cost report is available', () => {
    afterEach(() => {
      getReport.mockClear();
      getSources.mockClear();
    });

    // This test fails due to an accessibility issue within PF PieCart
    // PF takes the ariaDesc prop and incorrectly uses it to set
    // aria-described by vs using aria-labelledby
    it.skip('is accessible with cluster costs', async () => {
      const { container } = render(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={availableState.sources}
          report={availableState.report}
        />,
      );

      await checkAccessibility(container);
    });

    it('calls getSources and getReport on mount', () => {
      expect(getSources).not.toBeCalled();
      expect(getReport).not.toBeCalled();
      render(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={availableState.sources}
          report={initialState.report}
        />,
      );
      expect(getSources).toBeCalled();
      expect(getReport).toBeCalled();
    });
  });
});
