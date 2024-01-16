import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';

describe('<TransferClusterOwnershipDialog />', () => {
  const subscription = {
    id: '0',
    released: false,
    status: subscriptionStatuses.ACTIVE,
  };
  const requestState = {
    fulfilled: false,
    error: false,
    pending: false,
  };

  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();

  const defaultProps = {
    closeModal,
    onClose,
    submit,
    subscription,
    requestState,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<TransferClusterOwnershipDialog {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should release clusters', async () => {
    const notReleasedProps = {
      ...defaultProps,
      subscription: { ...subscription, released: false },
    };
    const { user } = render(<TransferClusterOwnershipDialog {...notReleasedProps} />);
    expect(submit).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Initiate transfer' }));
    expect(submit).toBeCalledWith('0', true);
  });

  it('should not show dialog for canceling transfer', () => {
    const releasedProps = {
      ...defaultProps,
      subscription: { ...subscription, released: true },
    };
    const { container } = render(<TransferClusterOwnershipDialog {...releasedProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should show dialog for transferring disconnected clusters', () => {
    const disconnectedProps = {
      ...defaultProps,
      subscription: {
        ...subscription,
        released: false,
        status: subscriptionStatuses.DISCONNECTED,
      },
    };

    render(<TransferClusterOwnershipDialog {...disconnectedProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show error', () => {
    const errorProps = {
      ...defaultProps,
      requestState: { error: true, errorMessage: 'this is an error' },
    };

    render(<TransferClusterOwnershipDialog {...errorProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
  });

  it('should display modal when subscription is undefined', () => {
    const undefinedProps = {
      ...defaultProps,
      subscription: undefined,
    };

    render(<TransferClusterOwnershipDialog {...undefinedProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
