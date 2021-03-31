import React from 'react';
import { mount } from 'enzyme';

import MachineTypeSelection from './MachineTypeSelection';

import {
  rhInfraClusterQuota,
  awsCCSClustersWithNodesQuota,
  awsCCSClustersWithSingleNodeQuota,
} from '../../../../../common/__test__/quota.fixtures';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  machineTypes: {},
};

const organizationState = {
  fulfilled: true,
  pending: false,
};

describe('<MachineTypeSelection />', () => {
  let sortedMachineTypes;
  let machineTypesByID = {};

  beforeAll(() => {
    sortedMachineTypes = [
      {
        kind: 'MachineType',
        name: 'Memory optimized - R5.XLarge',
        category: 'memory_optimized',
        id: 'r5.xlarge',
        resource_name: 'mem.small',
        href: '/api/clusters_mgmt/v1/machine_types/r5.xlarge',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 4,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
      },
      {
        kind: 'MachineType',
        name: 'Memory optimized - R5.4XLarge',
        category: 'memory_optimized',
        id: 'r5.4xlarge',
        resource_name: 'mem.large',
        href: '/api/clusters_mgmt/v1/machine_types/r5.4xlarge',
        memory: {
          value: 137438953472,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
      },
      {
        kind: 'MachineType',
        name: 'm5.12xlarge - General purpose',
        category: 'general_purpose',
        size: 'xlarge',
        id: 'm5.12xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/m5.12xlarge',
        memory: {
          value: 206158430208,
          unit: 'B',
        },
        cpu: {
          value: 48,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        ccs_only: true,
        resource_name: 'gp.xlarge',
      },
      {
        kind: 'MachineType',
        name: 'g4dn.2xlarge - Accelerated Computing (1 GPU)',
        category: 'accelerated_computing',
        size: 'medium',
        id: 'g4dn.2xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/g4dn.2xlarge',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        ccs_only: true,
      },
    ];
  });

  describe('when machine type list needs to be fetched', () => {
    let onChange;
    let getMachineTypes;
    let wrapper;
    beforeAll(() => {
      onChange = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={baseState}
          sortedMachineTypes={sortedMachineTypes}
          machineTypesByID={machineTypesByID}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          getMachineTypes={getMachineTypes}
          isBYOC={false}
          cloudProviderID="aws"
          isMachinePool={false}
          product="OSD"
          billingModel="standard"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when there was an error', () => {
    let onChange;
    let getMachineTypes;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      onChange = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={state}
          sortedMachineTypes={sortedMachineTypes}
          machineTypesByID={machineTypesByID}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          getMachineTypes={getMachineTypes}
          isBYOC={false}
          cloudProviderID="aws"
          isMachinePool={false}
          product="OSD"
          billingModel="standard"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let onChange;
    let getMachineTypes;
    let wrapper;
    const state = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      types: [],
    };
    beforeAll(() => {
      onChange = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={state}
          sortedMachineTypes={sortedMachineTypes}
          machineTypesByID={machineTypesByID}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          getMachineTypes={getMachineTypes}
          isBYOC={false}
          cloudProviderID="aws"
          isMachinePool={false}
          product="OSD"
          billingModel="standard"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the machine types list is available', () => {
    let onChange;
    let getMachineTypes;
    let wrapper;
    beforeAll(() => {
      machineTypesByID = {
        'r5.xlarge': {
          kind: 'MachineType',
          name: 'Memory optimized - R5.XLarge',
          category: 'memory_optimized',
          id: 'r5.xlarge',
          resource_name: 'mem.small',
          href: '/api/clusters_mgmt/v1/machine_types/r5.xlarge',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 4,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'r5.4xlarge': {
          kind: 'MachineType',
          name: 'Memory optimized - R5.4XLarge',
          category: 'memory_optimized',
          id: 'r5.4xlarge',
          resource_name: 'mem.large',
          href: '/api/clusters_mgmt/v1/machine_types/r5.4xlarge',
          memory: {
            value: 137438953472,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'm5.12xlarge': {
          kind: 'MachineType',
          name: 'm5.12xlarge - General purpose',
          category: 'general_purpose',
          size: 'xlarge',
          id: 'm5.12xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/m5.12xlarge',
          memory: {
            value: 206158430208,
            unit: 'B',
          },
          cpu: {
            value: 48,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          ccs_only: true,
          resource_name: 'gp.xlarge',
        },
      };
    });

    describe('with rhinfra quota available', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = rhInfraClusterQuota;
        onChange = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('calls onChange with the first item that has quota', () => {
        expect(onChange).toBeCalledWith('r5.xlarge');
      });

      it('does not display ccs_only machine types', () => {
        expect(wrapper.find('FlatRadioButton')).toHaveLength(2);
      });
    });

    describe('byoc with sufficient byoc quota available', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = awsCCSClustersWithNodesQuota;
        onChange = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('calls onChange with the first item that has quota', () => {
        expect(onChange).toBeCalledWith('r5.xlarge');
      });

      it('displays ccs_only machine types', () => {
        expect(wrapper.find('FlatRadioButton')).toHaveLength(4);
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = awsCCSClustersWithSingleNodeQuota;
        onChange = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            getMachineTypes={getMachineTypes}
            isMachinePool={false}
            isMultiAz
            isBYOC
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('does not call onChange', () => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });
});
