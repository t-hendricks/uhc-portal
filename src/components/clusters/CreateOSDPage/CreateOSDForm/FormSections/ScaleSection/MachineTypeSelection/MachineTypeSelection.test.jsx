import React from 'react';
import { mount } from 'enzyme';
import MachineTypeSelection from './MachineTypeSelection';

import {
  rhQuotaList,
  CCSQuotaList,
  CCSOneNodeRemainingQuotaList,
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

const machineTypesByID = {
  'm5.xlarge': {
    kind: 'MachineType',
    name: 'm5.xlarge - General Purpose',
    category: 'general_purpose',
    size: 'small',
    id: 'm5.xlarge',
    href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
    memory: {
      value: 17179869184,
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
    ccs_only: false,
    generic_name: 'standard-4',
  },
  'm5.4xlarge': {
    kind: 'MachineType',
    name: 'm5.4xlarge - General Purpose',
    category: 'general_purpose',
    size: 'large',
    id: 'm5.4xlarge',
    href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
    memory: {
      value: 68719476736,
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
    ccs_only: false,
    generic_name: 'standard-16',
  },
  'm5.12xlarge': {
    kind: 'MachineType',
    name: 'm5.12xlarge - General purpose',
    category: 'general_purpose',
    size: 'xxlarge',
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
    generic_name: 'standard-48',
  },
  'g4dn.2xlarge': {
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
    generic_name: 't4-gpu-8',
  },
};

const sortedMachineTypes = [
  machineTypesByID['m5.xlarge'],
  machineTypesByID['m5.4xlarge'],
  machineTypesByID['m5.12xlarge'],
  machineTypesByID['g4dn.2xlarge'],
];

describe('<MachineTypeSelection />', () => {
  describe('when machine type list needs to be fetched', () => {
    let onChange;
    let getMachineTypes;
    let wrapper;
    beforeEach(() => {
      onChange = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={baseState}
          sortedMachineTypes={[]}
          machineTypesByID={{}}
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
    beforeEach(() => {
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
          sortedMachineTypes={[]}
          machineTypesByID={{}}
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
    beforeEach(() => {
      onChange = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={state}
          sortedMachineTypes={[]}
          machineTypesByID={{}}
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

    describe('with rhinfra quota available', () => {
      beforeEach(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = rhQuotaList;
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
        expect(onChange).toBeCalledWith('m5.xlarge');
      });

      it('does not display ccs_only machine types, only machines with quota', () => {
        const types = wrapper.find('SelectOption').getElements().map(e => e.key);
        expect(types).not.toContain('m5.12xlarge');
        expect(types).not.toContain('g4dn.2xlarge');
      });
    });

    describe('byoc with sufficient byoc quota available', () => {
      beforeEach(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = CCSQuotaList;
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
        expect(onChange).toBeCalledWith('m5.xlarge');
      });

      it('displays only machine types with quota', () => {
        wrapper.find('SelectToggle').simulate('click');
        const types = wrapper.find('SelectOption').getElements().map(e => e.key);
        expect(types).toContain('m5.xlarge');
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      beforeEach(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = CCSOneNodeRemainingQuotaList;
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
