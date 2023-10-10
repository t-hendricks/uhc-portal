import React from 'react';
import { shallow } from 'enzyme';
import { render, checkAccessibility } from '@testUtils';
import { TextInput } from '@patternfly/react-core';

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

  it('delete button should be enabled only after inputting the add on name', () => {
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeTruthy(); // disabled at first

    wrapper.find(TextInput).simulate('change', 'fake');
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeTruthy(); // disabled when unrelated input

    wrapper.find(TextInput).simulate('change', 'fake-addon-name');
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeFalsy(); // enabled when correct
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
