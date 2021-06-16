import React from 'react';
import { mount } from 'enzyme';

import DisconnectedCloudRegionComboBox from './CloudRegionComboBox';

const availableRegions = [{
  id: 'us-east-1', display_name: 'N. Virginia', enabled: true, ccs_only: false,
}];

describe('<CloudRegionComboBox />', () => {
  describe('when region list needs to be fetched', () => {
    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    beforeAll(() => {
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
    beforeAll(() => {
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
    beforeAll(() => {
      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
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
    let onChange;
    let handleCloudRegionChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        error: false,
        errorMessage: '',
        pending: false,
        fulfilled: true,
        providers: {
          aws: {
            regions: {
              'us-east-1': { id: 'us-east-1', display_name: 'N. Virginia', enabled: true },
              'eu-west-1': { id: 'eu-west-1', display_name: 'Ireland', enabled: false },
            },
          },
        },
      };

      onChange = jest.fn();
      handleCloudRegionChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
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

    it('renders only enabled regions', () => {
      expect(wrapper.find('FormSelectOption').children()).toHaveLength(1);
    });

    it('should call handleCloudRegionChange on selection', () => {
      wrapper.find('.cloud-region-combo-box').at(0).simulate('change', {
        target: { value: availableRegions[0].id, selectedIndex: 0 },
      });
      expect(handleCloudRegionChange).toBeCalled();
    });
  });
});
