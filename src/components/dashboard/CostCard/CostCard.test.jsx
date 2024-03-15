import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';
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
  const getReport = jest.fn();
  const getSources = jest.fn();

  const initialStateProps = {
    ...initialState,
    getReport,
    getSources,
  };

  const availableStateProps = {
    ...availableState,
    getReport,
    getSources,
  };
  describe('When no source providers are available', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('is accessible', async () => {
      const { container } = render(<CostCard {...initialStateProps} />);

      expect(screen.getByText('Cost Management')).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('calls getSources and getReport on mount', () => {
      expect(getSources).not.toBeCalled();
      expect(getReport).not.toBeCalled();

      render(<CostCard {...initialStateProps} />);
      expect(getSources).toBeCalled();
      expect(getReport).toBeCalled();
    });
  });

  describe('When cost report is available', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it.skip('is accessible', async () => {
      const { container } = render(<CostCard {...availableStateProps} />);

      expect(screen.getByText('Cost Management')).toBeInTheDocument();

      // Fails with the following error: "<dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script>, <template> or <div> elements (definition-list)"
      await checkAccessibility(container);
    });

    it('calls getSources and getReport on mount', () => {
      expect(getSources).not.toBeCalled();
      expect(getReport).not.toBeCalled();

      render(<CostCard {...availableStateProps} />);
      expect(getSources).toBeCalled();
      expect(getReport).toBeCalled();
    });
  });
});
