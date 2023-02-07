import React from 'react';
import { shallow, mount } from 'enzyme';

import MachinePools from '../MachinePools';

import { baseRequestState } from '../../../../../../redux/reduxHelpers';

const getMachinePools = jest.fn();
const deleteMachinePool = jest.fn();
const openModal = jest.fn();
const getOrganizationAndQuota = jest.fn();
const getMachineTypes = jest.fn();

const defaultMachinePool = {
  id: 'some-id',
  instance_type: 'm5.xlarge',
  availability_zones: ['us-east-1'],
  desired: 1,
};

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
  getMachinePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse: jest.fn(),
  getOrganizationAndQuota,
  getMachineTypes,
  machineTypes: {},
  hasMachinePoolsQuota: true,
};

const osdProps = {
  ...baseProps,
  defaultMachinePool: { ...defaultMachinePool },
  isHypershift: false,
};

describe('<MachinePools />', () => {
  it('should call getMachinePools on mount', () => {
    shallow(<MachinePools {...osdProps} />);
    expect(getMachinePools).toBeCalled();
  });

  it('renders with the default machine pool', () => {
    const wrapper = shallow(<MachinePools {...osdProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with the default machine pool when it has labels', () => {
    const props = {
      ...osdProps,
      defaultMachinePool: {
        ...osdProps.defaultMachinePool,
        labels: { foo: 'bar', hello: 'world' },
      },
    };
    const wrapper = shallow(<MachinePools {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with additional machine pools, some with labels and/or taints', () => {
    const props = {
      ...osdProps,
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

    const wrapper = shallow(<MachinePools {...osdProps} machinePoolsList={{ data }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should open modal', () => {
    const wrapper = shallow(<MachinePools {...osdProps} />);

    wrapper.find('#add-machine-pool').simulate('click');
    expect(openModal).toBeCalledWith('add-machine-pool');
  });

  it('should render skeleton while fetching machine pools', () => {
    const wrapper = shallow(<MachinePools {...osdProps} />);

    wrapper.setProps({ machinePoolsList: { ...baseRequestState, pending: true, data: [] } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Skeleton').length).toBeGreaterThan(0);
  });

  it('should not allow adding machine pools to users without permissions', () => {
    const props = { ...osdProps, cluster: { canEdit: false } };
    const wrapper = shallow(<MachinePools {...props} />);

    expect(wrapper.find('#add-machine-pool').props().disableReason).toBeTruthy();
  });

  it('should not allow adding machine pools to users without enough quota', () => {
    const props = { ...osdProps, hasMachinePoolsQuota: false };
    const wrapper = shallow(<MachinePools {...props} />);

    expect(wrapper.find('#add-machine-pool').props().disableReason).toBeTruthy();
  });

  it('Should disable unavailable actions in kebab menu if hypershift', () => {
    const props = {
      ...baseProps,
      isHypershift: true,
      machinePoolsList: {
        data: [
          {
            kind: 'NodePool',
            href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
            id: 'workers',
            replicas: 2,
            auto_repair: true,
            aws_node_pool: {
              instance_type: 'm5.xlarge',
              instance_profile: 'staging-21gitfhopbgmmfhlu65v93n4g4n3djde-jknhystj27-worker',
              tags: {
                'api.openshift.com/environment': 'staging',
              },
            },
            availability_zone: 'us-east-1b',
            subnet: 'subnet-049f90721559000de',
            status: {
              current_replicas: 2,
            },
          },
          {
            kind: 'NodePool',
            href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
            id: 'additional-np',
            replicas: 3,
            auto_repair: true,
            aws_node_pool: {
              instance_type: 'm5.xlarge',
              instance_profile: 'staging-21gitfhopbgmmfhlu65v93n4g4n3djde-jknhystj27-worker',
              tags: {
                'api.openshift.com/environment': 'staging',
              },
            },
            availability_zone: 'us-east-1b',
            subnet: 'subnet-049f90721559000de',
            status: {
              current_replicas: 3,
            },
          },
        ],
      },
    };
    const wrapper = mount(<MachinePools {...props} />);
    // need to find by classname because action menu doesn't have an accessible label
    const actionMenus = wrapper.find('.pf-c-dropdown__toggle');
    expect(actionMenus).toHaveLength(2);

    actionMenus.forEach((button) => {
      expect(button.props().disabled).toBeFalsy();
      button.simulate('click');
      wrapper.update();
      const menuItems = wrapper.find('.pf-c-dropdown__menu .pf-c-dropdown__menu-item');
      expect(menuItems.length).toBeGreaterThan(0);
      menuItems.forEach((item) => {
        // Only the delete action is currently available
        if (item.text() === 'Delete') {
          expect(item.props()['aria-disabled']).toBeFalsy();
        } else {
          expect(item.props()['aria-disabled']).toBeTruthy();
        }
      });
    });
  });

  it('Should disable delete action in kebab menu if there is only one node pool and hypershift is true', () => {
    const props = {
      ...baseProps,
      isHypershift: true,
      machinePoolsList: {
        data: [
          {
            kind: 'NodePool',
            href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
            id: 'workers',
            replicas: 2,
            auto_repair: true,
            aws_node_pool: {
              instance_type: 'm5.xlarge',
              instance_profile: 'staging-21gitfhopbgmmfhlu65v93n4g4n3djde-jknhystj27-worker',
              tags: {
                'api.openshift.com/environment': 'staging',
              },
            },
            availability_zone: 'us-east-1b',
            subnet: 'subnet-049f90721559000de',
            status: {
              current_replicas: 2,
            },
          },
        ],
      },
    };
    const wrapper = mount(<MachinePools {...props} />);
    const deleteButton = wrapper.find('ActionsColumn').props().items[1];
    expect(deleteButton.title).toBe('Delete');
    expect(deleteButton.isAriaDisabled).toBeTruthy();
  });

  it('Should enable all actions in kebab menu if hypershift is false', () => {
    const props = {
      ...baseProps,
      isHypershift: false,
      machinePoolsList: {
        data: [
          {
            kind: 'NodePool',
            href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
            id: 'workers',
            replicas: 2,
            auto_repair: true,
            aws_node_pool: {
              instance_type: 'm5.xlarge',
              instance_profile: 'staging-21gitfhopbgmmfhlu65v93n4g4n3djde-jknhystj27-worker',
              tags: {
                'api.openshift.com/environment': 'staging',
              },
            },
            availability_zone: 'us-east-1b',
            subnet: 'subnet-049f90721559000de',
            status: {
              current_replicas: 2,
            },
          },
        ],
      },
    };
    const wrapper = mount(<MachinePools {...props} />);
    // need to find by classname because action menu doesn't have an accessible label
    const actionMenus = wrapper.find('.pf-c-dropdown__toggle');
    expect(actionMenus).toHaveLength(2);

    actionMenus.forEach((button) => {
      expect(button.props().disabled).toBeFalsy();
      button.simulate('click');
      wrapper.update();
      const menuItems = wrapper.find('.pf-c-dropdown__menu .pf-c-dropdown__menu-item');
      expect(menuItems.length).toBeGreaterThan(0);
      menuItems.forEach((item) => {
        expect(item.props()['aria-disabled']).toBeFalsy();
      });
    });
  });

  it('Add machine pool button is disabled if hypershift', () => {
    const props = { ...baseProps, isHypershift: true };
    const wrapper = shallow(<MachinePools {...props} />);

    const addMachinePoolButton = wrapper.find('#add-machine-pool');
    expect(addMachinePoolButton.props().disableReason).toBeTruthy();
  });

  it('Add machine pool button is enabled if not hypershift', () => {
    const wrapper = shallow(<MachinePools {...osdProps} />);
    const addMachinePoolButton = wrapper.find('#add-machine-pool');
    expect(addMachinePoolButton.props().disableReason).toBeFalsy();
  });

  it('should render error message', () => {
    const props = { ...baseProps, deleteMachinePoolResponse: { ...baseRequestState, error: true } };
    const wrapper = shallow(<MachinePools {...props} />);

    expect(wrapper.find('ErrorBox').length).toBe(1);
  });

  it('should close error message', () => {
    const props = { ...baseProps, deleteMachinePoolResponse: { ...baseRequestState, error: true } };
    const wrapper = shallow(<MachinePools {...props} />);
    const errorBox = wrapper.find('ErrorBox');
    errorBox.props().onCloseAlert();
    expect(wrapper.find('ErrorBox').length).toBe(0);
  });
});
