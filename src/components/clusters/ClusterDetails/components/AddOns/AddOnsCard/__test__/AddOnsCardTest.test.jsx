import React from 'react';
import { shallow } from 'enzyme';
import { Dropdown } from '@patternfly/react-core';

import AddOnsCard from '../AddOnsCard';
import AddOnsConstants from '../../AddOnsConstants';

describe('<AddOnsCard />', () => {
  let wrapper;
  let openModal;
  let addClusterAddOn;
  beforeAll(() => {
    openModal = jest.fn();
    addClusterAddOn = jest.fn();
    wrapper = shallow(
      <AddOnsCard
        addOn={{
          description: 'Dummy Desc',
          enabled: true,
          has_external_resources: false,
          hidden: false,
          id: 'Dummy ID',
          kind: 'AddOn',
          label: 'api.openshift.com/dummy',
          name: 'Dummy Name',
          operator_name: 'dummy-operator',
          parameters: {
            items: [{
              id: 'dummy item',
              enabled: true,
            }],
          },
        }}
        cluster={{
          canEdit: true,
          console: { url: 'https://dummy.devshift.org' },
        }}
        installedAddOn={{
          state: AddOnsConstants.INSTALLATION_STATE.READY,
        }}
        hasQuota
        openModal={openModal}
        addClusterAddOn={addClusterAddOn}
        addClusterAddOnResponse={{
          fulfilled: false,
          pending: false,
          error: false,
        }}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('addon drop down menus items should be enabled if canEdit is true', () => {
    const dropdown = wrapper.find(Dropdown).props();
    dropdown.dropdownItems.forEach(item => expect(item.props.isDisabled).toBeFalsy());
  });

  it('addon dropdown when cluster addon is installing', () => {
    const installedAddOn = {
      state: AddOnsConstants.INSTALLATION_STATE.INSTALLING,
    };
    wrapper.setProps({ installedAddOn }, () => {
      expect(wrapper.find(Dropdown).props().toggle.props.isDisabled).toBeFalsy();

      const dropdown = wrapper.find(Dropdown).props();
      // configure dropdown item should be disabled
      expect(dropdown.dropdownItems[0].props.isDisabled).toBeTruthy();
      // delete dropdown item should be enabled
      expect(dropdown.dropdownItems[1].props.isDisabled).toBeFalsy();
    });
  });

  it('addon dropdown when cluster addon is installing', () => {
    const installedAddOn = {
      state: AddOnsConstants.INSTALLATION_STATE.FAILED,
    };
    wrapper.setProps({ installedAddOn }, () => {
      expect(wrapper.find(Dropdown).props().toggle.props.isDisabled).toBeFalsy();

      const dropdown = wrapper.find(Dropdown).props();
      // configure dropdown item should be disabled
      expect(dropdown.dropdownItems[0].props.isDisabled).toBeTruthy();
      // delete dropdown item should be enabled
      expect(dropdown.dropdownItems[1].props.isDisabled).toBeFalsy();
    });
  });

  it('addon drop down should be disabled if canEdit is false', () => {
    const cluster = {
      canEdit: false,
      console: { url: 'https://dummy.devshift.org' },
    };
    wrapper.setProps({ cluster }, () => {
      expect(wrapper.find(Dropdown).props().toggle.props.isDisabled).toBeTruthy();
    });
  });

  it('addon drop down menu items should be disabled if addon is deleting', () => {
    const cluster = {
      canEdit: true,
      console: { url: 'https://dummy.devshift.org' },
    };
    const installedAddOn = {
      state: AddOnsConstants.INSTALLATION_STATE.DELETING,
    };
    wrapper.setProps({ installedAddOn, cluster }, () => {
      const dropdown = wrapper.find(Dropdown).props();
      dropdown.dropdownItems.forEach(item => expect(item.props.isDisabled).toBeTruthy());
    });
  });
});
