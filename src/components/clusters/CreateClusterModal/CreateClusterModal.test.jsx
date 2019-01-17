import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterModal from './CreateClusterModal';

describe('CreateClusterModal', () => {
  let closeModal;
  let resetResponse;
  let handleSubmit;
  let createClusterResponse;
  let wrapper;

  beforeEach(() => {
    closeModal = jest.fn();
    resetResponse = jest.fn();
    handleSubmit = jest.fn();
    createClusterResponse = {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: false,
      cluster: null,
    };


    wrapper = shallow(<CreateClusterModal
      closeModal={closeModal}
      resetResponse={resetResponse}
      handleSubmit={handleSubmit}
      createClusterResponse={createClusterResponse}
      isOpen
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should respond to submit form', () => {
    wrapper.find('[type="submit"]').at(0).simulate('click');
    expect(handleSubmit).toBeCalled();
  });
});
