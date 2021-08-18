import React from 'react';
import { shallow } from 'enzyme';
import { TextInput } from '@patternfly/react-core';

import AddOnsDeleteModal from '../AddOnsDeleteModal';

describe('<AddOnsDeleteModal />', () => {
  let wrapper;
  let closeModal;
  let deleteClusterAddOn;
  let clearClusterAddOnsResponses;
  beforeEach(() => {
    closeModal = jest.fn();
    deleteClusterAddOn = jest.fn();
    clearClusterAddOnsResponses = jest.fn();
    wrapper = shallow(
      <AddOnsDeleteModal
        isOpen
        modalData={{
          addOnName: 'fake-addon-name',
          addOnID: 'fake-addon-id',
          clusterID: 'fake-cluster-id',
        }}
        closeModal={closeModal}
        deleteClusterAddOn={deleteClusterAddOn}
        clearClusterAddOnsResponses={clearClusterAddOnsResponses}
        deleteClusterAddOnResponse={{ fulfilled: false, pending: false, error: false }}
      />,
    );
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
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
