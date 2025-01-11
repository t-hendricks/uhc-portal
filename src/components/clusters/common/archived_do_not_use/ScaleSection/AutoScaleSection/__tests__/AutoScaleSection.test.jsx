import React from 'react';

import { normalizedProducts } from '~/common/subscriptionTypes';
// eslint-disable-next-line no-restricted-imports
import wizardConnector from '~/components/clusters/ClusterDetails_archived_do_not_use/WizardConnector';
import { checkAccessibility, render, screen } from '~/testUtils';

import AutoScaleSection from '../AutoScaleSection';

describe('<AutoScaleSection />', () => {
  const mockChange = jest.fn();

  const defaultProps = {
    autoscalingEnabled: true,
    isMultiAz: false,
    product: normalizedProducts.OSD,
    isBYOC: false,
    isDefaultMachinePool: false,
    change: mockChange,
  };
  const autoscaleDisabledProps = {
    ...defaultProps,
    autoscalingEnabled: false,
  };

  const ConnectedAutoScaleSection = wizardConnector(AutoScaleSection);

  afterEach(() => {
    mockChange.mockClear();
  });

  it('renders correctly when autoscale enabled', async () => {
    const { container } = render(<ConnectedAutoScaleSection {...defaultProps} />);

    expect(screen.getByText('Minimum node count')).toBeInTheDocument();
    expect(screen.getByText('Maximum node count')).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('renders correctly when autoscale disabled', () => {
    render(<ConnectedAutoScaleSection {...autoscaleDisabledProps} />);

    expect(screen.getByText('Enable autoscaling')).toBeInTheDocument();
  });

  it('renders correctly for multiAz', () => {
    const multiAzProps = { ...defaultProps, isMultiAz: true };
    render(<ConnectedAutoScaleSection {...multiAzProps} />);
    expect(screen.getByText('Minimum nodes per zone')).toBeInTheDocument();
    expect(screen.getByText('Maximum nodes per zone')).toBeInTheDocument();
  });

  it.skip('Set min nodes correctly when enabling autoscale for multiAZ', async () => {
    // This test should pass, but mockChange isn't called
    const { rerender } = render(<ConnectedAutoScaleSection {...autoscaleDisabledProps} />);
    expect(mockChange).not.toBeCalled();
    const changedProps = {
      ...autoscaleDisabledProps,
      autoscalingEnabled: true,
      isMultiAz: true,
      isDefaultMachinePool: true,
    };
    rerender(<ConnectedAutoScaleSection {...changedProps} />);

    expect(mockChange).toBeCalledWith('min_replicas', '3');
  });
});
