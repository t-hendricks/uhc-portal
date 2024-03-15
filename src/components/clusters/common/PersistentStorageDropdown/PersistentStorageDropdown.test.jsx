import React from 'react';
import { render, screen, checkAccessibility, within } from '~/testUtils';
import PersistentStorageDropdown from './PersistentStorageDropdown';
import fixtures from '../../ClusterDetails/__tests__/ClusterDetails.fixtures';
import { storageQuotaList } from '../__tests__/quota.fixtures';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
};

describe('<PersistentStorageDropdown />', () => {
  const getPersistentStorage = jest.fn();
  const onChange = jest.fn();

  const defaultCluster = fixtures.clusterDetails.cluster;
  const defaultProps = {
    persistentStorageValues: baseState,
    input: { onChange },
    getPersistentStorage,
    quotaList: storageQuotaList,
    product: defaultCluster.subscription.plan.type,
    cloudProviderID: defaultCluster.cloud_provider.id,
    billingModel: 'standard',
    isBYOC: defaultCluster.ccs.enabled,
    isMultiAZ: defaultCluster.multi_az,
    disabled: false,
  };
  const errorState = { ...baseState, error: true, errorMessage: 'This is an error message' };

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when persistent storage list needs to be fetched', () => {
    it('calls getPersistentStorage on mount and is accessible', async () => {
      expect(getPersistentStorage).not.toBeCalled();
      const { container } = render(<PersistentStorageDropdown {...defaultProps} />);

      expect(getPersistentStorage).toBeCalled();
      expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument();

      await checkAccessibility(container);
    });
  });

  describe('when there was an error', () => {
    const errorState = { ...baseState, error: true, errorMessage: 'This is an error message' };
    const errorProps = { ...defaultProps, persistentStorageValues: errorState };

    it('displays an error', async () => {
      const { container } = render(<PersistentStorageDropdown {...errorProps} />);

      expect(
        within(screen.getByTestId('alert-error')).getByText('This is an error message'),
      ).toBeInTheDocument();
      await checkAccessibility(container);
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

    const pendingProps = { ...defaultProps, persistentStorageValues: pendingState };

    it('displays a spinner', async () => {
      const { container } = render(<PersistentStorageDropdown {...pendingProps} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading persistent storage list...')).toBeInTheDocument();

      await checkAccessibility(container);
    });

    it('does not call getPersistentStorage again if request returns an error', () => {
      const { rerender } = render(<PersistentStorageDropdown {...pendingProps} />);
      expect(getPersistentStorage).not.toBeCalled();

      rerender(
        <PersistentStorageDropdown {...{ ...pendingProps, persistentStorageValues: errorState }} />,
      );
      expect(getPersistentStorage).not.toBeCalled();
    });
  });

  describe('when the storage list is available', () => {
    const fulFilledState = {
      ...baseState,
      fulfilled: true,
      values: [
        { unit: 'B', value: 107374182400 },
        { unit: 'B', value: 644245094400 },
        { unit: 'B', value: 1181116006400 },
      ],
    };
    const fulFilledProps = { ...defaultProps, persistentStorageValues: fulFilledState };

    it('displays expected options', async () => {
      const { container } = render(<PersistentStorageDropdown {...fulFilledProps} />);

      expect(screen.getAllByRole('option')).toHaveLength(fulFilledState.values.length);

      expect(screen.getByRole('option', { name: '100 GiB' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '600 GiB' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '1100 GiB' })).toBeInTheDocument();

      await checkAccessibility(container);
    });
  });
});
