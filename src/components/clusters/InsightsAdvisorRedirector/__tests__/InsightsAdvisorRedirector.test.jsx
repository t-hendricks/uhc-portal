import React from 'react';

import { render, screen, within } from '~/testUtils';

import InsightsAdvisorRedirector, { composeRuleId } from '../InsightsAdvisorRedirector';

// Instead of mocking window.location, mocking  whole components
jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'),
  Navigate: jest.fn(({ to }) => `Redirected to "${to}"`),
}));

jest.mock('../ExternalRedirect', () => ({
  __esModule: true,
  default: jest.fn(({ url }) => `Redirected to external path "${url}"`),
}));

describe('<InsightsAdvisorRedirector />', () => {
  const setGlobalError = jest.fn();
  const fetchClusterDetails = jest.fn();
  const defaultProps = {
    params: { id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa' },
    location: {
      pathname: '/details/5d5892d3-1f74-4ccf-91af-548dfc9767aa',
      hash: '#insights',
    },
    setGlobalError,
    fetchClusterDetails,
    clusterDetails: {
      error: null,
      fulfilled: false,
    },
  };

  afterAll(() => {
    jest.unmock('react-router-dom-v5-compat');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redirection to Advisor cluster page: with the external ID', () => {
    it('should redirect', async () => {
      render(<InsightsAdvisorRedirector {...defaultProps} />);

      expect(
        screen.getByText(
          'Redirected to external path "/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa"',
        ),
      ).toBeInTheDocument();
    });

    it('should not call fetchClusterDetails', () => {
      render(<InsightsAdvisorRedirector {...defaultProps} />);
      expect(fetchClusterDetails).not.toBeCalled();
    });
  });

  describe('redirection to Advisor recommendation page: with the external ID', () => {
    const redirectionProps = {
      ...defaultProps,
      params: {
        id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
        reportId: 'ccx_rules_ocp|external|rules|master_defined_as_machinesets|report',
        errorKey: 'MASTER_DEFINED_AS_MACHINESETS',
      },

      location: {
        pathname:
          '/details/5d5892d3-1f74-4ccf-91af-548dfc9767aa/insights/ccx_rules_ocp|external|rules|master_defined_as_machinesets|report/MASTER_DEFINED_AS_MACHINESETS',
      },
    };

    it('should redirect', () => {
      render(<InsightsAdvisorRedirector {...redirectionProps} />);

      expect(
        screen.getByText(
          'Redirected to external path "/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa?first=ccx_rules_ocp.external.rules.master_defined_as_machinesets%7CMASTER_DEFINED_AS_MACHINESETS"',
        ),
      ).toBeInTheDocument();
    });

    it('should not call fetchClusterDetails', () => {
      render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(fetchClusterDetails).not.toBeCalled();
    });
  });

  describe('redirection to Advisor cluster page: with the subscription ID', () => {
    const redirectionProps = {
      ...defaultProps,
      params: { id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa' },
      location: {
        pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
        hash: '#insights',
      },
    };

    it('should render spinner and call fetchClusterDetails', () => {
      render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument();
    });

    it('should call fetchClusterDetails', () => {
      expect(fetchClusterDetails).not.toBeCalled();
      render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(fetchClusterDetails).toBeCalledWith('1ZyOzuBzgnXcKa92ZE2E4olYmQa');
    });

    it('should redirect after successful external ID fetch', () => {
      const { rerender } = render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(fetchClusterDetails).toBeCalledWith('1ZyOzuBzgnXcKa92ZE2E4olYmQa');

      const fulfilledProps = {
        ...redirectionProps,
        clusterDetails: {
          error: null,
          fulfilled: true,
          cluster: {
            external_id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
          },
        },
      };

      rerender(<InsightsAdvisorRedirector {...fulfilledProps} />);

      expect(
        screen.getByText(
          'Redirected to external path "/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa"',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('redirection to Advisor recommendation page: with the subscription ID', () => {
    const redirectionProps = {
      ...defaultProps,
      params: {
        id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
        reportId: 'ccx_rules_ocp|external|rules|master_defined_as_machinesets|report',
        errorKey: 'MASTER_DEFINED_AS_MACHINESETS',
      },
      location: {
        pathname:
          '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa/insights/ccx_rules_ocp|external|rules|master_defined_as_machinesets|report/MASTER_DEFINED_AS_MACHINESETS',
      },
    };

    it('should render spinner', () => {
      render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument();
    });

    it('should call fetchClusterDetails', () => {
      expect(fetchClusterDetails).not.toBeCalled();
      render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(fetchClusterDetails).toBeCalledWith('1ZyOzuBzgnXcKa92ZE2E4olYmQa');
    });

    it('should redirect after successful external ID fetch', () => {
      const { rerender } = render(<InsightsAdvisorRedirector {...redirectionProps} />);
      expect(fetchClusterDetails).toBeCalledWith('1ZyOzuBzgnXcKa92ZE2E4olYmQa');

      const fulfilledProps = {
        ...redirectionProps,
        clusterDetails: {
          error: null,
          fulfilled: true,
          cluster: {
            external_id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
          },
        },
      };

      rerender(<InsightsAdvisorRedirector {...fulfilledProps} />);

      expect(
        screen.getByText(
          'Redirected to external path "/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa?first=ccx_rules_ocp.external.rules.master_defined_as_machinesets%7CMASTER_DEFINED_AS_MACHINESETS"',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('on error', () => {
    const onErrorProps = {
      ...defaultProps,
      clusterDetails: {
        error: true,
        errorMessage: 'error message',
        fulfilled: false,
      },
      params: {
        id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
      },
      location: {
        pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
      },
    };

    it('should render a redirect to /', () => {
      render(<InsightsAdvisorRedirector {...onErrorProps} />);

      expect(screen.getByText('Redirected to "/"')).toBeInTheDocument();
    });

    it('should call setGlobalError', () => {
      expect(setGlobalError).not.toBeCalled();
      render(<InsightsAdvisorRedirector {...onErrorProps} />);
      expect(setGlobalError).toBeCalledWith(expect.anything(), 'clusterDetails', 'error message');
    });
  });

  describe('no external ID available', () => {
    const noExternalIdProps = {
      ...defaultProps,
      params: {
        id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
      },
      location: {
        pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
      },
      clusterDetails: {
        error: false,
        fulfilled: true,
        cluster: { external_id: '' },
      },
    };

    it('should render a redirect to /', () => {
      render(<InsightsAdvisorRedirector {...noExternalIdProps} />);

      expect(screen.getByText('Redirected to "/"')).toBeInTheDocument();
    });

    it('should call setGlobalError', () => {
      expect(setGlobalError).not.toBeCalled();
      render(<InsightsAdvisorRedirector {...noExternalIdProps} />);
      expect(setGlobalError).toBeCalledWith(expect.anything(), 'clusterDetails', undefined);
    });
  });
});

describe('Insights Advisor redirection utilities', () => {
  const testData = [
    [
      'ccx_rules_ocp|external|rules|master_defined_as_machinesets|report',
      'MASTER_DEFINED_AS_MACHINESETS',
      'ccx_rules_ocp.external.rules.master_defined_as_machinesets%7CMASTER_DEFINED_AS_MACHINESETS',
    ],
    [
      'ccx_rules_ocm%7Ctutorial_rule%7Creport',
      'TUTORIAL_ERROR',
      'ccx_rules_ocm.tutorial_rule%7CTUTORIAL_ERROR',
    ],
    [
      'ccx_rules_ocm|tutorial_rule%7Creport',
      'TUTORIAL_ERROR',
      'ccx_rules_ocm.tutorial_rule%7CTUTORIAL_ERROR',
    ],
  ];

  it.each(testData)('%s plugin', (pluginName, errorKey, expected) => {
    expect(composeRuleId(pluginName, errorKey)).toBe(expected);
  });
});
