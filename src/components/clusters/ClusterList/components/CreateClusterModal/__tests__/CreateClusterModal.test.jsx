import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterModal from '../CreateClusterModal';
import ManagedClusterForm from '../ManagedClusterForm';
import SelfManagedClusterForm from '../SelfManagedClusterForm';

describe('CreateClusterModal', () => {
  let closeModal;
  let resetResponse;
  let handleSubmit;
  let createClusterResponse;
  let wrapper;
  let managedWrapper;

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
      isManaged={false}
      isOpen
    />);

    managedWrapper = shallow(<CreateClusterModal
      closeModal={closeModal}
      resetResponse={resetResponse}
      handleSubmit={handleSubmit}
      createClusterResponse={createClusterResponse}
      isManaged
      isOpen
    />);
  });

  describe('ManagedClusterForm', () => {
    it('should render managed form', () => {
      expect(managedWrapper).toMatchSnapshot();
    });

    it('should respond to submit form', () => {
      managedWrapper.find('[type="submit"]').at(0).simulate('click');
      expect(handleSubmit).toBeCalled();
    });

    it('should display ManagedClusterForm for managed CreateClusterModal', () => {
      expect(managedWrapper.find(ManagedClusterForm).exists()).toBe(true);
      expect(managedWrapper.find(SelfManagedClusterForm).exists()).toBe(false);
    });
  });

  describe('SelfManagedClusterForm', () => {
    it('should render self managed form', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should respond to submit form', () => {
      wrapper.find('[type="submit"]').at(0).simulate('click');
      expect(handleSubmit).toBeCalled();
    });

    it('should display SelfManagedClusterForm for self-managed CreateClusterModal', () => {
      expect(wrapper.find(ManagedClusterForm).exists()).toBe(false);
      expect(wrapper.find(SelfManagedClusterForm).exists()).toBe(true);
    });
  });
});
