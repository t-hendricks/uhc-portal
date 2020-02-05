import React from 'react';
import { mount } from 'enzyme';

import PersistentStorageDropdown from './PersistentStorageDropdown';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

const organizationState = {
  fulfilled: true,
  pending: false,
};

describe('<PersistentStorageDropdown />', () => {
  describe('when persistent storage list needs to be fetched', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    beforeAll(() => {
      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={baseState}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quota={{}}
          organization={organizationState}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getPersistentStorage', () => {
      expect(getPersistentStorage).toBeCalled();
    });
  });

  describe('when there was an error', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quota={{}}
          organization={organizationState}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    const state = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      values: [],
    };
    beforeAll(() => {
      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quota={{}}
          organization={organizationState}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getPersistentStorage again if request returns an error', () => {
      wrapper.setProps({
        persistentStorageValues: { ...state, error: true, pending: false },
      }, () => {
        expect(getPersistentStorage).not.toBeCalled();
      });
    });
  });

  describe('when the storage list is available', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        fulfilled: true,
        values: [{ unit: 'B', value: 107374182400 }, { unit: 'B', value: 644245094400 }, { unit: 'B', value: 1181116006400 }],
      };

      const quota = {
        persistentStorageQuota: 600,
      };

      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quota={quota}
          organization={organizationState}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
