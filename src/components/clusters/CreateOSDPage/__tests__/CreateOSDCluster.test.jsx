import React from 'react';
import { shallow } from 'enzyme';

import {
  awsByocRhInfraGcpRhInfraClustersQuota,
  awsRhInfraGcpRhInfraClustersQuota,
} from '../../common/__test__/quota.fixtures';

import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';

import CreateOSDCluster from '../CreateOSDPage';
import CreateOSDForm from '../CreateOSDForm/CreateOSDForm';

describe('CreateOSDCluster', () => {
  let resetResponse;
  let resetForm;
  let getOrganizationAndQuota;
  let handleSubmit;
  let openModal;
  let closeModal;
  let isBYOCModalOpen;
  let change;
  let privateClusterSelected;
  let createClusterResponse;
  let managedWrapper;
  const { STANDARD } = billingModels;

  beforeEach(() => {
    resetResponse = jest.fn();
    getOrganizationAndQuota = jest.fn();
    resetForm = jest.fn();
    handleSubmit = jest.fn();
    openModal = jest.fn();
    closeModal = jest.fn();
    isBYOCModalOpen = false;
    change = jest.fn();
    privateClusterSelected = false;
    createClusterResponse = {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: false,
      cluster: null,
    };
    const fulfilledRequest = {
      pending: false,
      error: false,
      fulfilled: true,
    };

    managedWrapper = shallow(<CreateOSDCluster
      resetResponse={resetResponse}
      resetForm={resetForm}
      handleSubmit={handleSubmit}
      openModal={openModal}
      closeModal={closeModal}
      isBYOCModalOpen={isBYOCModalOpen}
      change={change}
      privateClusterSelected={privateClusterSelected}
      createClusterResponse={createClusterResponse}
      getOrganizationAndQuota={getOrganizationAndQuota}
      getMachineTypes={jest.fn()}
      getLoadBalancers={jest.fn()}
      getPersistentStorage={jest.fn()}
      getCloudProviders={jest.fn()}
      organization={fulfilledRequest}
      cloudProviders={fulfilledRequest}
      machineTypes={fulfilledRequest}
      loadBalancerValues={fulfilledRequest}
      persistentStorageValues={fulfilledRequest}
      product={normalizedProducts.OSD}
      cloudProviderID="aws"
      clustersQuota={awsByocRhInfraGcpRhInfraClustersQuota}
      canAutoScale
      autoscalingEnabled={false}
      billingModel={STANDARD}
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
      expect(managedWrapper.find(CreateOSDForm).exists()).toBe(true);
    });

    it('should fetch cloud providers, machine types, load balancers, persistent storage and quota when first mounted', () => {
      const getMachineTypes = jest.fn();
      const getLoadBalancers = jest.fn();
      const getPersistentStorage = jest.fn();
      const getCloudProviders = jest.fn();
      const initialRequestStatus = {
        pending: false,
        fulfilled: false,
        error: false,
      };
      const pendingRequest = {
        ...initialRequestStatus,
        pending: true,
      };
      const wrapper = shallow(<CreateOSDCluster
        resetResponse={resetResponse}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        openModal={openModal}
        closeModal={closeModal}
        isBYOCModalOpen={isBYOCModalOpen}
        change={change}
        privateClusterSelected={privateClusterSelected}
        createClusterResponse={createClusterResponse}
        getOrganizationAndQuota={getOrganizationAndQuota}
        getMachineTypes={getMachineTypes}
        getCloudProviders={getCloudProviders}
        getLoadBalancers={getLoadBalancers}
        getPersistentStorage={getPersistentStorage}
        organization={initialRequestStatus}
        cloudProviders={initialRequestStatus}
        machineTypes={initialRequestStatus}
        persistentStorageValues={initialRequestStatus}
        loadBalancerValues={initialRequestStatus}
        product={normalizedProducts.OSD}
        cloudProviderID="aws"
        clustersQuota={awsRhInfraGcpRhInfraClustersQuota}
        canAutoScale={false}
        autoscalingEnabled={false}
        billingModel={STANDARD}
      />);
      expect(getOrganizationAndQuota).toBeCalled();
      expect(getMachineTypes).toBeCalled();
      expect(getCloudProviders).toBeCalled();
      wrapper.setProps({
        organization: pendingRequest,
        cloudProviders: pendingRequest,
        machineTypes: pendingRequest,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
