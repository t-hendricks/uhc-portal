import React from 'react';
import { shallow } from 'enzyme';
import { TextInput } from '@patternfly/react-core';

import DeleteClusterDialog from '../DeleteClusterDialog';

describe('<DeleteClusterDialog />', () => {
  let wrapper;
  let clear;
  let closeModal;
  let onClose;
  let deleteCluster;
  beforeEach(() => {
    clear = jest.fn();
    closeModal = jest.fn();
    deleteCluster = jest.fn();
    onClose = jest.fn();
    wrapper = shallow(
      <DeleteClusterDialog
        isOpen
        modalData={{
          clusterName: 'fake-name',
          clusterID: 'fake-id',
        }}
        clearDeleteClusterResponse={clear}
        close={closeModal}
        onClose={onClose}
        deleteCluster={deleteCluster}
        deleteClusterResponse={{ fulfilled: false, pending: false, error: false }}
      />,
    );
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('delete button should be disabled', () => {
    const modal = wrapper.find('Modal');
    expect(modal.props().isPrimaryDisabled).toBeTruthy();
  });

  it('delete button should be enabled only after inputting the cluster name', () => {
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeTruthy(); // disabled at first

    wrapper.find(TextInput).simulate('change', 'fake');
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeTruthy(); // disabled when unrelated input

    wrapper.find(TextInput).simulate('change', 'fake-name');
    expect(wrapper.find('Modal').props().isPrimaryDisabled).toBeFalsy(); // enabled when correct
  });

  it('should call deleteCluster correctly', () => {
    const modal = wrapper.find('Modal');
    modal.props().onPrimaryClick();
    expect(deleteCluster).toBeCalledWith('fake-id');
  });

  it('should close modal on cancel', () => {
    const modal = wrapper.find('Modal');
    modal.props().onSecondaryClick();
    expect(closeModal).toBeCalled();
    expect(clear).toBeCalled();
    expect(onClose).toHaveBeenLastCalledWith(false);
  });

  it('should close correctly on succeess', () => {
    wrapper.setProps({ deleteClusterResponse: { fulfilled: true, pending: false, error: false } });
    expect(closeModal).toBeCalled();
    expect(clear).toBeCalled();
    expect(onClose).toHaveBeenLastCalledWith(true);
  });
});
