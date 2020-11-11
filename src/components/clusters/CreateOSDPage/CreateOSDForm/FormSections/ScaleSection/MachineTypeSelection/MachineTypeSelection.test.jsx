import React from 'react';
import { mount } from 'enzyme';

import MachineTypeSelection from './MachineTypeSelection';

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
  describe('when machine type list needs to be fetched', () => {
    let onChange;
    let wrapper;
    beforeAll(() => {
      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={baseState}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          product="OSD"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when there was an error', () => {
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={state}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          product="OSD"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let onChange;
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
      wrapper = mount(
        <MachineTypeSelection
          machineTypes={state}
          input={{ onChange }}
          meta={{}}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          product="OSD"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the machine types list is available', () => {
    let onChange;
    let wrapper;
    let sortedMachineTypes;
    let machineTypesByID;
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
      ];

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
      };
    });

    describe('with rhinfra quota available', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = {
          clustersQuota: {
            aws: {
              rhInfra: {
                multiAz: {
                  'mem.small': 5,
                },
                singleAz: {
                  'mem.small': 0,
                },
              },
            },
          },
        };

        onChange = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            isMultiAz
            cloudProviderID="aws"
            product="OSD"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('calls onChange with the first item that has quota', () => {
        expect(onChange).toBeCalledWith('r5.xlarge');
      });
    });

    describe('byoc with sufficient byoc quota available', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = {
          clustersQuota: {
            aws: {
              rhInfra: {
                singleAz: { available: 0 },
                multiAz: { available: 0 },
                totalAvailable: 0,
              },
              byoc: {
                singleAz: { available: 0 },
                multiAz: {
                  'mem.small': 5,
                  available: 5,
                },
                totalAvailable: 5,
              },
            },
          },
          nodesQuota: {
            aws: {
              byoc: {
                'mem.small': {
                  available: 12,
                  cost: 4,
                },
              },
            },
          },
        };

        onChange = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            isMultiAz
            isBYOC
            cloudProviderID="aws"
            product="OSD"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('calls onChange with the first item that has quota', () => {
        expect(onChange).toBeCalledWith('r5.xlarge');
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      beforeAll(() => {
        const state = {
          ...baseState,
          fulfilled: true,
        };
        const quota = {
          clustersQuota: {
            aws: {
              rhInfra: {
                singleAz: { available: 0 },
                multiAz: { available: 0 },
                totalAvailable: 0,
              },
              byoc: {
                singleAz: { available: 0 },
                multiAz: {
                  'mem.small': 5,
                  available: 5,
                },
                totalAvailable: 5,
              },
            },
          },
          nodesQuota: {
            aws: {
              byoc: {
                'mem.small': {
                  available: 4,
                  cost: 4,
                },
              },
            },
          },
        };

        onChange = jest.fn();
        wrapper = mount(
          <MachineTypeSelection
            machineTypes={state}
            sortedMachineTypes={sortedMachineTypes}
            machineTypesByID={machineTypesByID}
            input={{ onChange }}
            meta={{}}
            quota={quota}
            organization={organizationState}
            isMultiAz
            isBYOC
            cloudProviderID="aws"
            product="OSD"
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
