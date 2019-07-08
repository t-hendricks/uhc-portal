import React from 'react';
import { shallow } from 'enzyme';

import EditDisplayNameDialog from './EditDisplayNameDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditDisplayNameDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let resetResponse;
  const fakeEvent = input => ({
    preventDefault() {},
    target: { value: input },
  });
  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    resetResponse = jest.fn();
    wrapper = shallow(<EditDisplayNameDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      resetResponse={resetResponse}
      displayName="some-name"
      clusterID="some-id"
    />);
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when cancelled, calls closeModal but not onClose ', () => {
    wrapper.find('ModalFooter Button').at(0).simulate('click');
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits correctly', () => {
    wrapper.find('FormControl').simulate('change', fakeEvent('hello'));
    wrapper.find('ModalFooter Button').at(1).simulate('click');
    expect(submit).toBeCalledWith('some-id', 'hello');
  });

  it('when fulfilled, closes dialog', () => {
    wrapper.setProps({ editClusterResponse: { fulfilled: true } });
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, erorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
