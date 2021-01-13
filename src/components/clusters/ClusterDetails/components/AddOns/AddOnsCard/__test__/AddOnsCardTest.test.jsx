import React from 'react';
import { shallow } from 'enzyme';
import { Dropdown } from '@patternfly/react-core';

import AddOnsCard from '../AddOnsCard';

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
          state: 'ready',
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
    const { dropdownItems } = wrapper.find(Dropdown).props();
    dropdownItems.forEach(item => expect(item.props.isDisabled).toBeFalsy());
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
});
