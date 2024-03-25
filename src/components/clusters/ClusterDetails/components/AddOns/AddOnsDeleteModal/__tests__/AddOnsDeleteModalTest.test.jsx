import React from 'react';
import { shallow } from 'enzyme';

import { render, checkAccessibility, screen, fireEvent } from '~/testUtils';
import AddOnsDeleteModal from '../AddOnsDeleteModal';

describe('<AddOnsDeleteModal />', () => {
  let wrapper;
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

  beforeEach(() => {
    wrapper = shallow(<AddOnsDeleteModal {...props} />);
  });

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
    const { getByTestId } = render(<AddOnsDeleteModal {...props} />);
    const input = screen.getByPlaceholderText(/Enter name/i);

    expect(getByTestId('btn-primary')).toBeDisabled(); // disabled at first

    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.change(input, { target: { value: 'fake' } });
    expect(getByTestId('btn-primary')).toBeDisabled(); // disabled when unrelated input

    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.change(input, { target: { value: 'fake-addon-name' } });
    expect(getByTestId('btn-primary')).toBeEnabled(); // enabled when correct
  });

  it('should close modal on cancel', () => {
    const modal = wrapper.find('Modal');
    modal.props().onSecondaryClick();
    expect(closeModal).toBeCalled();
  });

  it('should call deleteClusterAddOn correctly', () => {
    const modal = wrapper.find('Modal');
    modal.props().onPrimaryClick();
    expect(deleteClusterAddOn).toBeCalledWith('fake-cluster-id', 'fake-addon-id');
  });

  it('should close correctly on succeess', () => {
    wrapper.setProps({
      deleteClusterAddOnResponse: { fulfilled: true, pending: false, error: false },
    });
    expect(closeModal).toBeCalled();
  });

  it('should clear response when modal is closed', () => {
    const modal = wrapper.find('Modal');
    modal.props().onSecondaryClick();
    expect(clearClusterAddOnsResponses).toBeCalled();
  });
});
