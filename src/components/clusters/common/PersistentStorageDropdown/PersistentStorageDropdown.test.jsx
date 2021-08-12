import React from 'react';
import { mount } from 'enzyme';

import PersistentStorageDropdown from './PersistentStorageDropdown';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';
import { storageQuotaList } from '../__test__/quota.fixtures';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
};

describe('<PersistentStorageDropdown />', () => {
  describe('when persistent storage list needs to be fetched', () => {
    let getPersistentStorage;
    let onChange;
    let wrapper;
    beforeEach(() => {
      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={baseState}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quotaList={storageQuotaList}
          product={fixtures.clusterDetails.cluster.subscription.plan.type}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
          disabled={false}
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
    beforeEach(() => {
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
          quotaList={storageQuotaList}
          product={fixtures.clusterDetails.cluster.subscription.plan.type}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
          disabled={false}
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
    beforeEach(() => {
      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quotaList={storageQuotaList}
          product={fixtures.clusterDetails.cluster.subscription.plan.type}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
          disabled={false}
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
    beforeEach(() => {
      const state = {
        ...baseState,
        fulfilled: true,
        values: [{ unit: 'B', value: 107374182400 }, { unit: 'B', value: 644245094400 }, { unit: 'B', value: 1181116006400 }],
      };

      getPersistentStorage = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <PersistentStorageDropdown
          persistentStorageValues={state}
          input={{ onChange }}
          getPersistentStorage={getPersistentStorage}
          quotaList={storageQuotaList}
          product={fixtures.clusterDetails.cluster.subscription.plan.type}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
