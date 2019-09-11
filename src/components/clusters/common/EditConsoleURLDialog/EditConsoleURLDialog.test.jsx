import React from 'react';
import { mount } from 'enzyme';

import EditConsoleURLDialog from './EditConsoleURLDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditConsoleURLDialog />', () => {
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
    wrapper = mount(<EditConsoleURLDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      resetResponse={resetResponse}
      clusterID="some-id"
      consoleURL="http://www.example.com"
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
    input.instance().value = 'http://www.example.com';
    input.at(0).simulate('change');
    wrapper.find('.pf-m-primary').simulate('click');
    expect(submit).toBeCalledWith('some-id', 'http://www.example.com');
  });

  it('when fulfilled, closes dialog', () => {
    wrapper.setProps({ editClusterResponse: { fulfilled: true, errorMessage: '' } });
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
