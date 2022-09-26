import React from 'react';
import { mount } from 'enzyme';

import DisconnectedCloudRegionComboBox from './CloudRegionComboBox';

const regions = {
  'us-east-1': {
    id: 'us-east-1',
    display_name: 'N. Virginia',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
  },
  'eu-west-1': {
    id: 'eu-west-1',
    display_name: 'Ireland',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
  },
  'disabled-2': {
    id: 'disabled-2',
    display_name: 'Kamchatka',
    enabled: false,
    ccs_only: false,
    supports_multi_az: true,
  },
  'single-az-3': {
    id: 'single-az-3',
    display_name: 'Antarctica',
    enabled: true,
    ccs_only: false,
    supports_multi_az: false,
  },
};
const availableRegions = Object.values(regions).filter((region) => region.enabled);

describe('<CloudRegionComboBox />', () => {
  describe('when region list needs to be fetched', () => {
    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    beforeEach(() => {
      const state = {
        error: false,
        errorMessage: '',
        pending: false,
        fulfilled: false,
        providers: {},
      };

      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          isMultiAz={false}
          input={{ onChange }}
          availableRegions={availableRegions}
          handleCloudRegionChange={handleCloudRegionChange}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when there was an error', () => {
    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    beforeEach(() => {
      const state = {
        error: true,
        errorMessage: 'This is an error message',
        pending: false,
        fulfilled: false,
        providers: {},
      };

      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          isMultiAz={false}
          input={{ onChange }}
          availableRegions={availableRegions}
          handleCloudRegionChange={handleCloudRegionChange}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    const state = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      providers: {},
    };
    beforeEach(() => {
      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          isMultiAz={false}
          input={{ onChange }}
          availableRegions={availableRegions}
          handleCloudRegionChange={handleCloudRegionChange}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the region list is available', () => {
    const state = {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: true,
      providers: {
        aws: {
          regions,
        },
      },
    };

    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    beforeEach(() => {
      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          isMultiAz={false}
          input={{ onChange, value: 'eu-west-1' }}
          availableRegions={availableRegions}
          handleCloudRegionChange={handleCloudRegionChange}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders only enabled regions', () => {
      const options = wrapper
        .find('FormSelectOption')
        .getElements()
        .map((e) => e.key);
      expect(options).toEqual(['us-east-1', 'eu-west-1', 'single-az-3']);
    });

    it('should call handleCloudRegionChange on selection', () => {
      wrapper
        .find('.cloud-region-combo-box')
        .at(0)
        .simulate('change', {
          target: { value: availableRegions[0].id, selectedIndex: 0 },
        });
      expect(handleCloudRegionChange).toBeCalled();
    });

    it('keeps region if compatible with multi-AZ', () => {
      wrapper.setProps({ isMultiAz: true });
      expect(handleCloudRegionChange).not.toBeCalled();
      expect(onChange).not.toBeCalled();
    });

    it('resets region if incompatible with multi-AZ', () => {
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          isMultiAz={false}
          input={{ onChange, value: 'single-az-3' }}
          availableRegions={availableRegions}
          handleCloudRegionChange={handleCloudRegionChange}
          disabled={false}
        />,
      );
      wrapper.setProps({ isMultiAz: true });
      expect(handleCloudRegionChange).toBeCalled();
      expect(onChange).toBeCalled();
    });
  });
});
