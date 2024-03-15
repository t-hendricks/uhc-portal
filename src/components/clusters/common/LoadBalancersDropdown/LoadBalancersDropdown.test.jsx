import React from 'react';
import { render, screen, checkAccessibility, within } from '~/testUtils';

import LoadBalancersDropdown from './LoadBalancersDropdown';
import fixtures from '../../ClusterDetails/__tests__/ClusterDetails.fixtures';
import { loadBalancerQuotaList } from '../__tests__/quota.fixtures';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

describe('<LoadBalancersDropdown />', () => {
  const getLoadBalancers = jest.fn();
  const onChange = jest.fn();

  const defaultProps = {
    loadBalancerValues: baseState,
    input: { onChange },
    getLoadBalancers,
    quotaList: loadBalancerQuotaList,
    product: fixtures.clusterDetails.cluster.subscription.plan.type,
    cloudProviderID: fixtures.clusterDetails.cluster.cloud_provider.id,
    billingModel: 'standard',
    isBYOC: fixtures.clusterDetails.cluster.ccs.enabled,
    isMultiAZ: fixtures.clusterDetails.cluster.multi_az,
    disabled: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when load balancer list needs to be fetched', () => {
    it('is accessible', async () => {
      const { container } = render(<LoadBalancersDropdown {...defaultProps} />);
      expect(screen.getByText('Loading load balancers list...')).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('calls getLoadBalancers', () => {
      expect(getLoadBalancers).not.toBeCalled();
      render(<LoadBalancersDropdown {...defaultProps} />);
      expect(getLoadBalancers).toBeCalled();
    });
  });

  describe('when there was an error', () => {
    const errorState = {
      ...baseState,
      error: true,
      errorMessage: 'This is an error message',
    };

    const errorProps = {
      ...defaultProps,
      loadBalancerValues: errorState,
    };

    it('displays an error', () => {
      render(<LoadBalancersDropdown {...errorProps} />);
      expect(getLoadBalancers).not.toBeCalled();
      expect(
        within(screen.getByTestId('alert-error')).getByText('This is an error message'),
      ).toBeInTheDocument();
    });
  });

  describe('when the request is pending', () => {
    const pendingState = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      values: [],
    };
    const pendingProps = {
      ...defaultProps,
      loadBalancerValues: pendingState,
    };

    it('displays a loading message', () => {
      render(<LoadBalancersDropdown {...pendingProps} />);
      expect(getLoadBalancers).not.toBeCalled();
      expect(screen.getByText('Loading load balancers list...')).toBeInTheDocument();
    });
  });

  describe('when the load balancer list is available', () => {
    const loadBalancerValues = [0, 4, 8, 12, 16, 20, 24];
    const availableState = {
      ...baseState,
      fulfilled: true,
      values: loadBalancerValues,
    };

    const availableProps = {
      ...defaultProps,
      loadBalancerValues: availableState,
    };

    it('shows expected options', async () => {
      // loadBalancerQuotaList allows 17.
      const listAllowedWithQuota = loadBalancerValues.filter((item) => item < 17);
      const { container } = render(<LoadBalancersDropdown {...availableProps} />);
      expect(getLoadBalancers).not.toBeCalled();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(listAllowedWithQuota.length);

      listAllowedWithQuota.forEach((item) => {
        expect(screen.getByRole('option', { name: item })).toBeInTheDocument();
      });
      await checkAccessibility(container);
    });
  });
});
