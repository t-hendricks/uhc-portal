import React from 'react';
import { mount } from 'enzyme';

import PersistentStorageComboBox from './PersistentStorageComboBox';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

describe('<PersistentStorageComboBox />', () => {
  describe('when persistent storage list needs to be fetched', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    beforeAll(() => {
      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageComboBox
          persistentStorageValues={baseState}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getPersistentStorage', () => {
      expect(getPersistentStorage).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
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
        <PersistentStorageComboBox
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getPersistentStorage on mount', () => {
      expect(getPersistentStorage).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
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
        <PersistentStorageComboBox
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });

    it('does not call getPersistentStorage again if request returns an error', () => {
      wrapper.setProps({
        machineTypes: { ...state, error: true, pending: false },
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

      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageComboBox
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getPersistentStorage', () => {
      expect(getPersistentStorage).not.toBeCalled();
    });
  });
});
