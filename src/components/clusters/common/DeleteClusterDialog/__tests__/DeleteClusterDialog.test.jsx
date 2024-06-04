import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import DeleteClusterDialog from '../DeleteClusterDialog';

describe('<DeleteClusterDialog />', () => {
  const clear = jest.fn();
  const closeModal = jest.fn();
  const deleteCluster = jest.fn();
  const onClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    modalData: {
      clusterName: 'my-cluster-name',
      clusterID: 'my-cluster-id',
    },
    clearDeleteClusterResponse: clear,
    close: closeModal,
    onClose,
    deleteCluster,
    deleteClusterResponse: { fulfilled: false, pending: false, error: false },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<DeleteClusterDialog {...defaultProps} />);
    await checkAccessibility(container);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('delete button is initially disabled', () => {
    render(<DeleteClusterDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('delete button is enabled  after inputting the cluster name', async () => {
    const { user } = render(<DeleteClusterDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');

    await user.type(screen.getByRole('textbox'), 'wrong_name');

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');

    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'my-cluster-name');

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('should call deleteCluster correctly', async () => {
    const { user } = render(<DeleteClusterDialog {...defaultProps} />);

    await user.type(screen.getByRole('textbox'), 'my-cluster-name');

    expect(deleteCluster).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteCluster).toBeCalledWith('my-cluster-id');
  });

  it('should close modal on cancel', async () => {
    const { user } = render(<DeleteClusterDialog {...defaultProps} />);
    expect(closeModal).not.toBeCalled();
    expect(clear).not.toBeCalled();
    expect(onClose).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closeModal).toBeCalled();
    expect(clear).toBeCalled();
    expect(onClose).toHaveBeenLastCalledWith(false);
  });

  it('should close correctly on success', () => {
    const { rerender } = render(<DeleteClusterDialog {...defaultProps} />);

    const newProps = {
      ...defaultProps,
      deleteClusterResponse: { fulfilled: true, pending: false, error: false },
    };
    rerender(<DeleteClusterDialog {...newProps} />);

    expect(closeModal).toBeCalled();
    expect(clear).toBeCalled();
    expect(onClose).toHaveBeenLastCalledWith(true);
  });
});
