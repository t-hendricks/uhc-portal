import React from 'react';
import { shallow } from 'enzyme';

import CreateOSDCluster from '../CreateOSDCluster';
import ManagedClusterForm from '../ManagedClusterForm';

describe('CreateOSDCluster', () => {
  let resetResponse;
  let resetForm;
  let handleSubmit;
  let createClusterResponse;
  let managedWrapper;

  beforeEach(() => {
    resetResponse = jest.fn();
    resetForm = jest.fn();
    handleSubmit = jest.fn();
    createClusterResponse = {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: false,
      cluster: null,
    };

    managedWrapper = shallow(<CreateOSDCluster
      resetResponse={resetResponse}
      resetForm={resetForm}
      handleSubmit={handleSubmit}
      createClusterResponse={createClusterResponse}
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

    it('should display ManagedClusterForm for managed CreateOSDCluster', () => {
      expect(managedWrapper.find(ManagedClusterForm).exists()).toBe(true);
    });

    it('should call resetResponse and resetForm on mount', () => {
      expect(resetResponse).toBeCalled();
      expect(resetForm).toBeCalled();
    });
  });
});
