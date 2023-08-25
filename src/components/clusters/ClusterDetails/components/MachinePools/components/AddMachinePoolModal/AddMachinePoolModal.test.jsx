import React from 'react';
import { shallow } from 'enzyme';

import AddMachinePoolModal from './AddMachinePoolModal';

describe('<AddMachinePoolModal />', () => {
  const closeModal = jest.fn();
  const clearAddMachinePoolResponse = jest.fn();
  const submit = jest.fn();
  const cluster = {
    managed: true,
    ccs: {
      enabled: false,
    },
    cloud_provider: {
      id: 'aws',
    },
    subscription: {
      plan: {
        id: 'OSD',
        type: 'OSD',
      },
    },
    multi_az: false,
  };
  const getOrganizationAndQuota = jest.fn();
  const getMachineTypes = jest.fn();
  const change = jest.fn();
  const pendingRequest = {
    pending: true,
    fulfilled: false,
    error: false,
  };
  const wrapper = shallow(
    <AddMachinePoolModal
      isOpen
      closeModal={closeModal}
      submit={submit}
      clearAddMachinePoolResponse={clearAddMachinePoolResponse}
      cluster={cluster}
      getOrganizationAndQuota={getOrganizationAndQuota}
      getMachineTypes={getMachineTypes}
      machineTypes={pendingRequest}
      pristine
      invalid={false}
      selectedMachineType="r5.2xlarge"
      canAutoScale
      autoscalingEnabled
      change={change}
      canUseSpotInstances={false}
      useSpotInstances={false}
      isHypershiftCluster={false}
    />,
  );
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
