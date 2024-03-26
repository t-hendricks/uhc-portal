import React from 'react';

import { render, checkAccessibility, screen } from '~/testUtils';
import AddOnsDeleteModal from '../AddOnsDeleteModal';

describe('<AddOnsDeleteModal />', () => {
  const closeModal = jest.fn();
  const deleteClusterAddOn = jest.fn();
  const clearClusterAddOnsResponses = jest.fn();

  const props = {
    isOpen: true,
    modalData: {
      addOnName: 'fake-addon-name',
      addOnID: 'fake-addon-id',
      clusterID: 'fake-cluster-id',
    },
    closeModal,
    deleteClusterAddOn,
    clearClusterAddOnsResponses,
    deleteClusterAddOnResponse: { fulfilled: false, pending: false, error: false },
  };

  afterEach(() => {
    closeModal.mockClear();
    deleteClusterAddOn.mockClear();
    clearClusterAddOnsResponses.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<AddOnsDeleteModal {...props} />);
    await checkAccessibility(container);
  });

  it('delete button should be enabled only after inputting the add on name', async () => {
    const { user } = render(<AddOnsDeleteModal {...props} />);

    expect(screen.getByRole('button', { name: 'Uninstall' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    const input = screen.getByPlaceholderText(/Enter name/i);
    await user.clear(input);
    await user.type(input, 'fake');

    expect(screen.getByRole('button', { name: 'Uninstall' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.clear(input);
    await user.type(input, 'fake-addon-name');

    expect(screen.getByRole('button', { name: 'Uninstall' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('should close modal on cancel', async () => {
    const { user } = render(<AddOnsDeleteModal {...props} />);
    expect(closeModal).not.toHaveBeenCalled();
    expect(clearClusterAddOnsResponses).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closeModal).toHaveBeenCalled();
    expect(clearClusterAddOnsResponses).toHaveBeenCalled();
  });

  it('should call deleteClusterAddOn correctly', async () => {
    const { user } = render(<AddOnsDeleteModal {...props} />);

    await user.clear(screen.getByPlaceholderText('Enter name'));
    await user.type(screen.getByPlaceholderText('Enter name'), 'fake-addon-name');
    await user.click(screen.getByRole('button', { name: 'Uninstall' }));

    expect(deleteClusterAddOn).toHaveBeenCalledWith('fake-cluster-id', 'fake-addon-id');
  });

  it('should close correctly on success', () => {
    const { rerender } = render(<AddOnsDeleteModal {...props} />);
    expect(closeModal).not.toHaveBeenCalled();
    const newProps = {
      ...props,
      deleteClusterAddOnResponse: { fulfilled: true, pending: false, error: false },
    };

    rerender(<AddOnsDeleteModal {...newProps} />);
    expect(closeModal).toHaveBeenCalled();
  });
});
