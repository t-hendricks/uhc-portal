import React from 'react';
import { shallow } from 'enzyme';
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
  let wrapper;
  let getReport;
  let getSources;
  describe('When no source providers are available', () => {
    beforeEach(() => {
      getReport = jest.fn();
      getSources = jest.fn();
      wrapper = shallow(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={initialState.sources}
          report={initialState.report}
        />,
      );
    });

    it('renders empty state', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('calls getSources on mount', () => {
      expect(getSources).toBeCalled();
    });
    it('calls getReport on mount', () => {
      expect(getSources).toBeCalled();
    });
  });

  describe('When cost report is available', () => {
    beforeEach(() => {
      getReport = jest.fn();
      getSources = jest.fn();
      wrapper = shallow(
        <CostBreakdownCard
          getReport={getReport}
          getSources={getSources}
          sources={availableState.sources}
          report={availableState.report}
        />,
      );
    });

    it('renders cluster costs', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('calls getSources on mount', () => {
      expect(getSources).toBeCalled();
    });
    it('calls getReport on mount', () => {
      expect(getReport).toBeCalled();
    });
  });
});

/**

 */
