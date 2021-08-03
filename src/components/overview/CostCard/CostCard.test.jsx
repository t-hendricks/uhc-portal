import React from 'react';
import { shallow } from 'enzyme';
import CostCard from './CostCard';

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
                clusters: [
                  'OCP-OnPrem01',
                ],
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
                clusters: [
                  'DemoCluster4.6-Go',
                ],
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
                clusters: [
                  'OpenShift on AWS',
                ],
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
                clusters: [
                  'OpenShift on Azure',
                ],
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

describe('<CostCard />', () => {
  let wrapper;
  let getReport;
  let getSources;
  describe('When no source providers are available', () => {
    beforeEach(() => {
      getReport = jest.fn();
      getSources = jest.fn();
      wrapper = shallow(
        <CostCard
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
      expect(getReport).toBeCalled();
    });
  });

  describe('When cost report is available', () => {
    beforeEach(() => {
      getReport = jest.fn();
      getSources = jest.fn();
      wrapper = shallow(
        <CostCard
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
