import React from 'react';
import { shallow } from 'enzyme';
import ErrorBox from '../../../common/ErrorBox';

import EditDisplayNameDialog from './EditClusterDialog';

describe('<EditDisplayNameDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let handleSubmit;
  let change;
  let resetResponse;
  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    handleSubmit = jest.fn();
    change = jest.fn();
    resetResponse = jest.fn();
    wrapper = shallow(<EditDisplayNameDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      handleSubmit={handleSubmit}
      change={change}
      resetResponse={resetResponse}
      initialFormValues={{ id: 'test-id', nodesCompute: 4 }}
      min={{ value: 4, validationMsg: 'error' }}
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
    wrapper.find('ModalFooter Button').at(1).simulate('click');
    expect(handleSubmit).toBeCalled();
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
