import React from 'react';
import { shallow } from 'enzyme';

import MachinePools from '../MachinePools';

import { baseRequestState } from '../../../../../../redux/reduxHelpers';

const getMachinePools = jest.fn();
const deleteMachinePool = jest.fn();
const openModal = jest.fn();
const getOrganizationAndQuota = jest.fn();
const getMachineTypes = jest.fn();

const baseProps = {
  cluster: {
    canEdit: true,
  },
  openModal,
  isAddMachinePoolModalOpen: false,
  isEditTaintsModalOpen: false,
  isEditLabelsModalOpen: false,
  deleteMachinePoolResponse: { ...baseRequestState },
  addMachinePoolResponse: { ...baseRequestState },
  scaleMachinePoolResponse: { ...baseRequestState },
  machinePoolsList: { ...baseRequestState, data: [] },
  defaultMachinePool: {
    id: 'some-id',
    instance_type: 'm5.xlarge',
    availability_zones: ['us-east-1'],
    desired: 1,
  },
  getMachinePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse: jest.fn(),
  getOrganizationAndQuota,
  getMachineTypes,
  machineTypes: {},
  hasMachinePoolsQuota: true,
};

describe('<MachinePools />', () => {
  it('should call getMachinePools on mount', () => {
    shallow(<MachinePools {...baseProps} />);
    expect(getMachinePools).toBeCalled();
  });

  it('renders with the default machine pool', () => {
    const wrapper = shallow(<MachinePools {...baseProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with the default machine pool when it has labels', () => {
    const props = {
      ...baseProps,
      defaultMachinePool: {
        ...baseProps.defaultMachinePool,
        labels: { foo: 'bar', hello: 'world' },
      },
    };
    const wrapper = shallow(<MachinePools {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with additional machine pools, some with labels and/or taints', () => {
    const props = {
      ...baseProps,
      machinePoolsList: {
        data: [
          {
            availability_zones: ['us-east-1a'],
            href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-labels-and-taints',
            id: 'mp-with-labels-and-taints',
            instance_type: 'm5.xlarge',
            kind: 'MachinePool',
            labels: { foo: 'bar' },
            replicas: 1,
            taints: [
              { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
              { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
            ],
          },
          {
            availability_zones: ['us-east-1a'],
            href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-labels',
            id: 'mp-with-label',
            instance_type: 'm5.xlarge',
            kind: 'MachinePool',
            labels: { foo: 'bar' },
            replicas: 1,
          },
          {
            availability_zones: ['us-east-1a'],
            href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints',
            id: 'mp-with-taints',
            instance_type: 'm5.xlarge',
            kind: 'MachinePool',
            replicas: 1,
            taints: [
              { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
              { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
            ],
          },
          {
            availability_zones: ['us-east-1a'],
            href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-no-labels-no-taints',
            id: 'mp-with-no-labels-no-taints',
            instance_type: 'm5.xlarge',
            kind: 'MachinePool',
            replicas: 1,
          },
        ],
      },
    };
    const wrapper = shallow(<MachinePools {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with a machine pool with autosacaling enabled', () => {
    const data = [
      {
        autoscaling: { max_replicas: 2, min_replicas: 1 },
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-autoscaling',
        id: 'mp-autoscaling',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        labels: { foo: 'bar' },
        taints: [
          { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
          { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
        ],
      },
    ];

    const wrapper = shallow(<MachinePools {...baseProps} machinePoolsList={{ data }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should open modal', () => {
    const wrapper = shallow(<MachinePools {...baseProps} />);

    wrapper.find('#add-machine-pool').simulate('click');
    expect(openModal).toBeCalledWith('add-machine-pool');
  });

  it('should render skeleton while fetching machine pools', () => {
    const wrapper = shallow(<MachinePools {...baseProps} />);

    wrapper.setProps({ machinePoolsList: { ...baseRequestState, pending: true, data: [] } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Skeleton').length).toBeGreaterThan(0);
  });

  it('should not allow adding machine pools to users without permissions', () => {
    const props = { ...baseProps, cluster: { canEdit: false } };
    const wrapper = shallow(<MachinePools {...props} />);

    expect(wrapper.find('#add-machine-pool').props().disableReason).toBeTruthy();
  });

  it('should not allow adding machine pools to users without enough quota', () => {
    const props = { ...baseProps, hasMachinePoolsQuota: false };
    const wrapper = shallow(<MachinePools {...props} />);

    expect(wrapper.find('#add-machine-pool').props().disableReason).toBeTruthy();
  });
});
