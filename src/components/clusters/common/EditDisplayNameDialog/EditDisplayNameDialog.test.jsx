import React from 'react';
import { mount } from 'enzyme';
import Modal from '../../../common/Modal/Modal';

import EditDisplayNameDialog from './EditDisplayNameDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditDisplayNameDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let resetResponse;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    resetResponse = jest.fn();
    wrapper = mount(<EditDisplayNameDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      resetResponse={resetResponse}
      displayName="some-name"
      clusterID="some-id"
      subscriptionID="some-other-id"
      editClusterResponse={{ errorMessage: '', error: false }}
    />);
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when cancelled, calls closeModal but not onClose ', () => {
    wrapper.find('.pf-m-secondary').at(0).simulate('click');
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits correctly', () => {
    const input = wrapper.find('.pf-c-form-control');
    input.instance().value = 'hello';
    input.at(0).simulate('change');
    wrapper.find('.pf-m-primary').simulate('click');
    expect(submit).toBeCalledWith('some-id', 'some-other-id', 'hello');
  });

  it('when fulfilled, closes dialog', () => {
    wrapper.setProps({ editClusterResponse: { fulfilled: true, errorMessage: '' } });
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an error occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });

  it('renders correctly when pending', () => {
    wrapper.setProps({ editClusterResponse: { pending: true, error: false, fulfilled: false } });
    expect(wrapper).toMatchSnapshot();
    const modal = wrapper.find(Modal);
    expect(modal.props().isPending).toBeTruthy();
  });
});
