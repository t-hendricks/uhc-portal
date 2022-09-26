import React from 'react';
import { shallow } from 'enzyme';

import InsightsAdvisorRedirector, { composeRuleId } from '../InsightsAdvisorRedirector';

describe('redirection to Advisor cluster page: with the external ID', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{ params: { id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa' } }}
        location={{
          pathname: '/details/5d5892d3-1f74-4ccf-91af-548dfc9767aa',
          hash: '#insights',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: null,
          fulfilled: false,
        }}
      />,
    );
  });

  it('should redirect', () => {
    const redirect = wrapper.find('ExternalRedirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().url).toBe(
      'http://localhost/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa',
    );
  });
  it('should not call fetchClusterDetails', () => {
    expect(fetchClusterDetails).not.toBeCalled();
  });
});

describe('redirection to Advisor recommendation page: with the external ID', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{
          params: {
            id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
            reportId: 'ccx_rules_ocp|external|rules|master_defined_as_machinesets|report',
            errorKey: 'MASTER_DEFINED_AS_MACHINESETS',
          },
        }}
        location={{
          pathname:
            '/details/5d5892d3-1f74-4ccf-91af-548dfc9767aa/insights/ccx_rules_ocp|external|rules|master_defined_as_machinesets|report/MASTER_DEFINED_AS_MACHINESETS',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: null,
          fulfilled: false,
        }}
      />,
    );
  });

  it('should redirect', () => {
    const redirect = wrapper.find('ExternalRedirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().url).toBe(
      'http://localhost/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa?first=ccx_rules_ocp.external.rules.master_defined_as_machinesets%7CMASTER_DEFINED_AS_MACHINESETS',
    );
  });
  it('should not call fetchClusterDetails', () => {
    expect(fetchClusterDetails).not.toBeCalled();
  });
});

describe('redirection to Advisor cluster page: with the subscription ID', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{ params: { id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa' } }}
        location={{
          pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
          hash: '#insights',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: null,
          fulfilled: false,
        }}
      />,
    );
  });

  it('should render spinner', () => {
    const spinner = wrapper.find('Spinner');
    expect(spinner.length).toBe(1);
  });
  it('should call fetchClusterDetails', () => {
    expect(fetchClusterDetails).toBeCalled();
  });
  it('should redirect after successful external ID fetch', () => {
    wrapper.setProps({
      clusterDetails: {
        error: null,
        fulfilled: true,
        cluster: {
          external_id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
        },
      },
    });
    const redirect = wrapper.find('ExternalRedirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().url).toBe(
      'http://localhost/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa',
    );
  });
});

describe('redirection to Advisor recommendation page: with the subscription ID', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{
          params: {
            id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
            reportId: 'ccx_rules_ocp|external|rules|master_defined_as_machinesets|report',
            errorKey: 'MASTER_DEFINED_AS_MACHINESETS',
          },
        }}
        location={{
          pathname:
            '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa/insights/ccx_rules_ocp|external|rules|master_defined_as_machinesets|report/MASTER_DEFINED_AS_MACHINESETS',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: null,
          fulfilled: false,
        }}
      />,
    );
  });

  it('should render spinner', () => {
    const spinner = wrapper.find('Spinner');
    expect(spinner.length).toBe(1);
  });
  it('should call fetchClusterDetails', () => {
    expect(fetchClusterDetails).toBeCalled();
  });
  it('should redirect after successful external ID fetch', () => {
    wrapper.setProps({
      clusterDetails: {
        error: null,
        fulfilled: true,
        cluster: {
          external_id: '5d5892d3-1f74-4ccf-91af-548dfc9767aa',
        },
      },
    });
    const redirect = wrapper.find('ExternalRedirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().url).toBe(
      'http://localhost/openshift/insights/advisor/clusters/5d5892d3-1f74-4ccf-91af-548dfc9767aa?first=ccx_rules_ocp.external.rules.master_defined_as_machinesets%7CMASTER_DEFINED_AS_MACHINESETS',
    );
  });
});

describe('on error', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{
          params: {
            id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
          },
        }}
        location={{
          pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: true,
          errorMessage: 'error message',
          fulfilled: false,
        }}
      />,
    );
  });

  it('should render a redirect to /', () => {
    expect(wrapper).toMatchSnapshot();
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().to).toEqual('/');
  });
  it('should call setGlobalError', () => {
    expect(setGlobalError).toBeCalledWith(expect.anything(), 'clusterDetails', 'error message');
  });
});

describe('no external ID available', () => {
  let setGlobalError;
  let fetchClusterDetails;
  let wrapper;

  beforeEach(() => {
    setGlobalError = jest.fn();
    fetchClusterDetails = jest.fn();
    wrapper = shallow(
      <InsightsAdvisorRedirector
        match={{
          params: {
            id: '1ZyOzuBzgnXcKa92ZE2E4olYmQa',
          },
        }}
        location={{
          pathname: '/details/s/1ZyOzuBzgnXcKa92ZE2E4olYmQa',
        }}
        setGlobalError={setGlobalError}
        fetchClusterDetails={fetchClusterDetails}
        clusterDetails={{
          error: false,
          fulfilled: true,
          cluster: { external_id: '' },
        }}
      />,
    );
  });

  it('should render a redirect to /', () => {
    expect(wrapper).toMatchSnapshot();
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.props().to).toEqual('/');
  });
  it('should call setGlobalError', () => {
    expect(setGlobalError).toBeCalledWith(expect.anything(), 'clusterDetails', undefined);
  });
});

describe('Insights Advisor redirection utilities', () => {
  it('composeRuleId', () => {
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

    testData.forEach(([pluginName, errorKey, expected]) =>
      expect(composeRuleId(pluginName, errorKey)).toBe(expected),
    );
  });
});
