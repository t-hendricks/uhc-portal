import React from 'react';
import { mount } from 'enzyme';

import MachineTypeSelector from './MachineTypeSelector';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  machineTypes: [],
};

describe('<MachineTypeSelector />', () => {
  describe('when machine type list needs to be fetched', () => {
    let getMachineTypes;
    let onChange;
    let wrapper;
    beforeAll(() => {
      getMachineTypes = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelector
          machineTypes={baseState}
          input={{ onChange }}
          meta={{}}
          getMachineTypes={getMachineTypes}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getCloudProviders', () => {
      expect(getMachineTypes).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });
  });

  describe('when there was an error', () => {
    let getMachineTypes;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      getMachineTypes = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelector
          cloudProviderID="aws"
          machineTypes={state}
          input={{ onChange }}
          meta={{}}
          getMachineTypes={getMachineTypes}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getMachineTypes on mount', () => {
      expect(getMachineTypes).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });
  });

  describe('when the request is pending', () => {
    let getMachineTypes;
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
      getMachineTypes = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelector
          cloudProviderID="aws"
          machineTypes={state}
          input={{ onChange }}
          meta={{}}
          getMachineTypes={getMachineTypes}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getCloudProviders', () => {
      expect(getMachineTypes).not.toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });

    it('does not call getMachineTypes again if request returns an error', () => {
      wrapper.setProps({
        machineTypes: { ...state, error: true, pending: false },
      }, () => {
        expect(getMachineTypes).not.toBeCalled();
      });
    });
  });

  describe('when the machine types list is available', () => {
    let getMachineTypes;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        fulfilled: true,
        types: [
          {
            kind: 'MachineType',
            name: 'Memory optimized - R5.4XLarge',
            id: 'r5.4xlarge',
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
            name: 'Memory optimized - R5.XLarge',
            id: 'r5.xlarge',
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
        ],
      };

      getMachineTypes = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <MachineTypeSelector
          cloudProviderID="aws"
          machineTypes={state}
          input={{ onChange }}
          meta={{}}
          getMachineTypes={getMachineTypes}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getMachineTypes', () => {
      expect(getMachineTypes).not.toBeCalled();
    });

    it('does not call onChange', () => {
      expect(onChange).not.toBeCalled();
    });
  });
});
