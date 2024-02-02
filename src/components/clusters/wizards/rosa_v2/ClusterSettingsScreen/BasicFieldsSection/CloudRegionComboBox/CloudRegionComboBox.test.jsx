import React from 'react';
import { screen, render, checkAccessibility, within } from '~/testUtils';

import DisconnectedCloudRegionComboBox from './CloudRegionComboBox';

const regions = {
  'us-east-1': {
    id: 'us-east-1',
    display_name: 'N. Virginia',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
  },
  'eu-west-1': {
    id: 'eu-west-1',
    display_name: 'Ireland',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
  },
  'disabled-2': {
    id: 'disabled-2',
    display_name: 'Kamchatka',
    enabled: false,
    ccs_only: false,
    supports_multi_az: true,
  },
  'single-az-3': {
    id: 'single-az-3',
    display_name: 'Antarctica',
    enabled: true,
    ccs_only: false,
    supports_multi_az: false,
  },
};

const availableRegions = Object.values(regions).filter((region) => region.enabled);

describe('<CloudRegionComboBox />', () => {
  const onChange = jest.fn();
  const handleCloudRegionChange = jest.fn();
  const initialState = {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    providers: {},
  };

  const defaultProps = {
    cloudProviderID: 'aws',
    cloudProviders: initialState,
    isMultiAz: false,
    input: { onChange },
    availableRegions,
    handleCloudRegionChange,
    disabled: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when region list needs to be fetched', () => {
    it('is accessible', async () => {
      const { container } = render(<DisconnectedCloudRegionComboBox {...defaultProps} />);

      expect(
        within(screen.getByRole('status')).getByText('Loading', { exact: false }),
      ).toBeInTheDocument();

      expect(screen.getByText('Loading region list', { exact: false })).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });

  describe('when there was an error', () => {
    const errorState = {
      ...initialState,
      error: true,
      errorMessage: 'This is an error message',
    };

    const errorProps = {
      ...defaultProps,
      cloudProviders: errorState,
    };

    it('is accessible', async () => {
      const { container } = render(<DisconnectedCloudRegionComboBox {...errorProps} />);

      expect(
        within(screen.getByRole('alert')).getByText('Error loading region list'),
      ).toBeInTheDocument();

      expect(
        within(screen.getByRole('alert')).getByText('This is an error message'),
      ).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });

  describe('when the request is pending', () => {
    const pendingState = {
      ...initialState,
      pending: true,
    };

    const pendingProps = {
      ...defaultProps,
      cloudProviders: pendingState,
    };

    it('is accessible', async () => {
      const { container } = render(<DisconnectedCloudRegionComboBox {...pendingProps} />);

      expect(
        within(screen.getByRole('status')).getByText('Loading', { exact: false }),
      ).toBeInTheDocument();

      expect(screen.getByText('Loading region list', { exact: false })).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });

  describe('when the region list is available', () => {
    const fulfilledState = {
      ...initialState,
      fulfilled: true,
      providers: {
        aws: {
          regions,
        },
      },
    };

    const fulfilledProps = {
      ...defaultProps,
      cloudProviders: fulfilledState,
    };

    it('is accessible', async () => {
      const { container } = render(<DisconnectedCloudRegionComboBox {...fulfilledProps} />);

      expect(screen.getAllByRole('option').length).toBeGreaterThan(0);

      await checkAccessibility(container);
    });

    describe('only shows enabled regions', () => {
      it.each(['us-east-1, N. Virginia', 'eu-west-1, Ireland', 'single-az-3, Antarctica'])(
        ' %s is an option',
        (region) => {
          render(<DisconnectedCloudRegionComboBox {...fulfilledProps} />);

          expect(screen.getByRole('option', { name: region })).toBeInTheDocument();
        },
      );
    });

    it('should call handleCloudRegionChange on selection', async () => {
      expect(handleCloudRegionChange).not.toBeCalled();
      const { user } = render(<DisconnectedCloudRegionComboBox {...fulfilledProps} />);

      expect(handleCloudRegionChange).toBeCalledTimes(1);
      expect(handleCloudRegionChange).toBeCalledWith();

      await user.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: 'single-az-3, Antarctica' }),
      );

      expect(handleCloudRegionChange).toBeCalledTimes(2);
      expect(handleCloudRegionChange).toHaveBeenLastCalledWith();
    });

    it('keeps region if compatible with multi-AZ', () => {
      const { rerender } = render(<DisconnectedCloudRegionComboBox {...fulfilledProps} />);
      expect(handleCloudRegionChange).toBeCalledTimes(1);
      expect(handleCloudRegionChange).toHaveBeenLastCalledWith();

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith('us-east-1');

      rerender(<DisconnectedCloudRegionComboBox {...fulfilledProps} isMultiAz />);

      expect(handleCloudRegionChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledTimes(1);
    });

    it('resets region if incompatible with multi-AZ', () => {
      const { rerender } = render(
        <DisconnectedCloudRegionComboBox
          {...fulfilledProps}
          input={{ onChange, value: 'single-az-3' }}
        />,
      );
      expect(handleCloudRegionChange).not.toBeCalled();
      expect(onChange).not.toBeCalled();

      rerender(
        <DisconnectedCloudRegionComboBox
          {...fulfilledProps}
          input={{ onChange, value: 'single-az-3' }}
          isMultiAz
        />,
      );
      expect(handleCloudRegionChange).toBeCalledTimes(1);
      expect(handleCloudRegionChange).toHaveBeenLastCalledWith();

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith('us-east-1');
    });
  });
});
