import React from 'react';
import { mount } from 'enzyme';

import { DisconnectedCloudRegionComboBox } from '../CloudRegionComboBox';

describe('<CloudRegionComboBox />', () => {
  describe('when region list needs to be fetched', () => {
    let getCloudProviders;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        error: false,
        errorMessage: '',
        pending: false,
        fulfilled: false,
        providers: {},
      };

      getCloudProviders = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          input={{ onChange }}
          getCloudProviders={getCloudProviders}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getCloudProviders', () => {
      expect(getCloudProviders).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });
  });

  describe('when there was an error', () => {
    let getCloudProviders;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        error: true,
        errorMessage: 'This is an error message',
        pending: false,
        fulfilled: false,
        providers: {},
      };

      getCloudProviders = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          input={{ onChange }}
          getCloudProviders={getCloudProviders}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getCloudProviders on mount', () => {
      expect(getCloudProviders).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });
  });

  describe('when the request is pending', () => {
    let getCloudProviders;
    let onChange;
    let wrapper;
    const state = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      providers: {},
    };
    beforeAll(() => {
      getCloudProviders = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          input={{ onChange }}
          getCloudProviders={getCloudProviders}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getCloudProviders', () => {
      expect(getCloudProviders).not.toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });

    it('does not call getCloudProviders if request returns an error', () => {
      wrapper.setProps({
        cloudProviders: { ...state, error: true, pending: false },
      }, () => {
        expect(getCloudProviders).not.toBeCalled();
      });
    });
  });

  describe('when the region list is available', () => {
    let getCloudProviders;
    let onChange;
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
              'us-east-1': { id: 'us-east-1', display_name: 'N. Virginia' },
              'eu-west-1': { id: 'eu-west-1', display_name: 'Ireland' },
            },
          },
        },
      };

      getCloudProviders = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <DisconnectedCloudRegionComboBox
          cloudProviderID="aws"
          cloudProviders={state}
          input={{ onChange }}
          getCloudProviders={getCloudProviders}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getCloudProviders', () => {
      expect(getCloudProviders).not.toBeCalled();
    });

    it('does not call onChange', () => {
      expect(onChange).not.toBeCalled();
    });
  });
});
