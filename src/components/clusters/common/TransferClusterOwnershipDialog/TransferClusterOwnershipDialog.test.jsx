import React from 'react';
import { mount } from 'enzyme';

import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import ErrorBox from '../../../common/ErrorBox';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';

describe('<TransferClusterOwnershipDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let subscription;
  let requestState;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    subscription = {
      id: '0',
      released: false,
      status: subscriptionStatuses.ACTIVE,
    };
    requestState = {
      fulfilled: false,
      error: false,
      pending: false,
    };
    wrapper = mount(<TransferClusterOwnershipDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      subscription={subscription}
      requestState={requestState}
    />);
  });

  it('should release clusters', () => {
    wrapper.setProps({ subscription: { ...subscription, released: false } });
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Button[type="submit"]').at(0).simulate('click');
    expect(submit).toBeCalledWith('0', true);
  });

  it('should not show dialog for canceling transfer', () => {
    wrapper.setProps({ subscription: { ...subscription, released: true } });
    expect(wrapper).toEqual({});
  });

  it('should show dialog for transferring disconnected clusters', () => {
    wrapper.setProps({
      subscription: {
        ...subscription,
        released: false,
        status: subscriptionStatuses.DISCONNECTED,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show error', () => {
    wrapper.setProps({ requestState: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });

  it('should not crash when subscription is undefined', () => {
    wrapper.setProps({ subscription: undefined });
    expect(wrapper).toMatchSnapshot();
  });
});
