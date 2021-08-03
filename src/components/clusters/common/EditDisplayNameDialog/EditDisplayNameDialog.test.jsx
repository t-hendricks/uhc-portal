import React from 'react';
import { mount, shallow } from 'enzyme';
import Modal from '../../../common/Modal/Modal';

import EditDisplayNameDialog from './EditDisplayNameDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditDisplayNameDialog />', () => {
  let wrapper;
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const resetResponse = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<EditDisplayNameDialog
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

  describe('mounted ', () => {
    beforeEach(() => {
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
      expect(submit).toBeCalledWith('some-other-id', 'hello');
    });

    it('when fulfilled, closes dialog', () => {
      wrapper.setProps({ editClusterResponse: { fulfilled: true, errorMessage: '' } });
      expect(closeModal).toBeCalled();
      expect(resetResponse).toBeCalled();
      expect(onClose).toBeCalled();
    });
  });
});
