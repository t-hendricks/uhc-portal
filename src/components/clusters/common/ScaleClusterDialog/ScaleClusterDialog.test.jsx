import React from 'react';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { checkAccessibility, render, screen } from '~/testUtils';

import ScaleClusterDialog from './ScaleClusterDialog';

describe('<ScaleClusterDialog />', () => {
  const ConnectedScaleClusterDialog = wizardConnector(ScaleClusterDialog);
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const handleSubmit = jest.fn();
  const change = jest.fn();
  const resetResponse = jest.fn();
  const getLoadBalancers = jest.fn();
  const getPersistentStorage = jest.fn();
  const getCloudProviders = jest.fn();
  const getOrganizationAndQuota = jest.fn();

  const fulfilledRequest = {
    pending: false,
    error: false,
    fulfilled: true,
  };

  const requestInitialState = {
    pending: false,
    error: false,
    fulfilled: false,
  };

  const defaultProps = {
    isOpen: true,
    closeModal,
    onClose,
    handleSubmit,
    change,
    resetResponse,
    getPersistentStorage,
    getCloudProviders,
    getOrganizationAndQuota,
    getLoadBalancers,
    loadBalancerValues: fulfilledRequest,
    persistentStorageValues: fulfilledRequest,
    organization: fulfilledRequest,
    cloudProviderID: 'aws',
    billingModel: 'standard',
    isMultiAZ: true,
    product: 'OSD',
    initialValues: {
      id: 'test-id',
      nodes_compute: 4,
      load_balancers: 4,
      persistent_storage: 107374182400,
    },
    min: { value: 4, validationMsg: 'error' },
    pristine: false,
    isByoc: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<ConnectedScaleClusterDialog {...defaultProps} />);

    expect(await screen.findByText('Load balancers')).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('when fulfilled, closes dialog', async () => {
    const { rerender } = render(<ConnectedScaleClusterDialog {...defaultProps} />);
    expect(closeModal).not.toBeCalled();
    expect(resetResponse).not.toBeCalled();
    expect(onClose).not.toBeCalled();

    const fulFilledProps = {
      ...defaultProps,
      editClusterResponse: { fulfilled: true },
    };

    rerender(<ConnectedScaleClusterDialog {...fulFilledProps} />);
    expect(await screen.findByText('Load balancers')).toBeInTheDocument();
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an error occurs', async () => {
    const errorProps = {
      ...defaultProps,
      editClusterResponse: { error: true, errorMessage: 'this is an error' },
    };

    render(<ConnectedScaleClusterDialog {...errorProps} />);
    expect(await screen.findByText('Load balancers')).toBeInTheDocument();

    // There are multiple errors due to the redux state not being in shape that is
    // expected for child components.  The logic we are checking is in the first alert.
    expect(screen.getByText('this is an error')).toBeInTheDocument();
  });

  describe('fetching data -', () => {
    it('on load fetches  storage and load balancers data', () => {
      const initialStateProps = {
        ...defaultProps,
        loadBalancerValues: requestInitialState,
        persistentStorageValues: requestInitialState,
      };

      expect(getLoadBalancers).not.toBeCalled();
      expect(getPersistentStorage).not.toBeCalled();

      render(<ConnectedScaleClusterDialog {...initialStateProps} />);
      expect(getLoadBalancers).toBeCalled();
      expect(getPersistentStorage).toBeCalled();
    });
  });
});
