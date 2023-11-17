import React from 'react';
import { render, screen, checkAccessibility, within, fireEvent } from '~/testUtils';
import EditDisplayNameDialog from './EditDisplayNameDialog';

describe('<EditDisplayNameDialog />', () => {
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const resetResponse = jest.fn();

  const defaultProps = {
    isOpen: true,
    closeModal,
    onClose,
    submit,
    resetResponse,
    displayName: 'my-display-name',
    clusterID: 'my-cluster-id',
    subscriptionID: 'my-subscription-id',
    editClusterResponse: { errorMessage: '', error: false },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible when first opened', async () => {
    const { container } = render(<EditDisplayNameDialog {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('is accessible when an error occurs', async () => {
    const newProps = {
      ...defaultProps,
      editClusterResponse: { error: true, errorMessage: 'this is an error' },
    };
    const { container } = render(<EditDisplayNameDialog {...newProps} />);

    expect(
      within(screen.getByRole('alert', { name: 'Danger Alert' })).getByText('this is an error'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is accessible when pending', async () => {
    const newProps = {
      ...defaultProps,
      editClusterResponse: { pending: true, error: false, fulfilled: false },
    };
    const { container } = render(<EditDisplayNameDialog {...newProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('when cancelled, calls closeModal but not onClose ', async () => {
    const { user } = render(<EditDisplayNameDialog {...defaultProps} />);
    expect(closeModal).not.toBeCalled();
    expect(resetResponse).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('calls submit when Edit button is clicked', async () => {
    const { user } = render(<EditDisplayNameDialog {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('aria-disabled', 'true');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'my-new-name' } });
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('aria-disabled', 'false');
    expect(submit).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(submit).toBeCalledWith('my-subscription-id', 'my-new-name');
  });

  it('once fulfilled calls closeModal, resetResponse, and onClose', () => {
    const { rerender } = render(<EditDisplayNameDialog {...defaultProps} />);

    expect(closeModal).not.toBeCalled();
    expect(resetResponse).not.toBeCalled();
    expect(onClose).not.toBeCalled();

    const newProps = {
      ...defaultProps,
      editClusterResponse: { fulfilled: true, errorMessage: '' },
    };

    rerender(<EditDisplayNameDialog {...newProps} />);

    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });
});
