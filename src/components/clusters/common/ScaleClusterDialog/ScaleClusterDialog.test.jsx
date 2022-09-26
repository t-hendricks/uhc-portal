import React from 'react';
import { shallow } from 'enzyme';
import ErrorBox from '../../../common/ErrorBox';

import ScaleClusterDialog from './ScaleClusterDialog';

describe('<ScaleClusterDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let handleSubmit;
  let change;
  let resetResponse;
  let getLoadBalancers;
  let getPersistentStorage;

  const fulfilledRequest = {
    pending: false,
    error: false,
    fulfilled: true,
  };

  const requestInitialState = {
    pending: false,
    error: false,
    fulfilled: false,
  };

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    handleSubmit = jest.fn();
    change = jest.fn();
    resetResponse = jest.fn();
    getLoadBalancers = jest.fn();
    getPersistentStorage = jest.fn();
    wrapper = shallow(
      <ScaleClusterDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        handleSubmit={handleSubmit}
        change={change}
        resetResponse={resetResponse}
        getPersistentStorage={getPersistentStorage}
        getCloudProviders={jest.fn()}
        getOrganizationAndQuota={jest.fn()}
        getLoadBalancers={getLoadBalancers}
        loadBalancerValues={fulfilledRequest}
        persistentStorageValues={fulfilledRequest}
        organization={fulfilledRequest}
        cloudProviderID="aws"
        billingModel="standard"
        isMultiAZ
        product="OSD"
        initialValues={{
          id: 'test-id',
          nodes_compute: 4,
          load_balancers: 4,
          persistent_storage: 107374182400,
        }}
        min={{ value: 4, validationMsg: 'error' }}
        pristine={false}
      />,
    );
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when fulfilled, closes dialog', () => {
    wrapper.setProps({ editClusterResponse: { fulfilled: true } });
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an error occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });

  describe('fecth data -', () => {
    it('should fetch machine types, storgae and load balancers data', () => {
      shallow(
        <ScaleClusterDialog
          isOpen
          closeModal={closeModal}
          onClose={onClose}
          handleSubmit={handleSubmit}
          change={change}
          resetResponse={resetResponse}
          getPersistentStorage={getPersistentStorage}
          getCloudProviders={jest.fn()}
          getOrganizationAndQuota={jest.fn()}
          getLoadBalancers={getLoadBalancers}
          loadBalancerValues={requestInitialState}
          persistentStorageValues={requestInitialState}
          organization={fulfilledRequest}
          cloudProviderID="aws"
          isMultiAZ
          billingModel="standard"
          product="OSD"
          initialValues={{
            id: 'test-id',
            nodes_compute: 4,
            load_balancers: 4,
            persistent_storage: 107374182400,
          }}
          min={{ value: 4, validationMsg: 'error' }}
          pristine={false}
        />,
      );
      expect(getLoadBalancers).toBeCalled();
      expect(getPersistentStorage).toBeCalled();
    });
  });
});
