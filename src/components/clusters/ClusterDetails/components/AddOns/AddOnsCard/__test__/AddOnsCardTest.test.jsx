import React from 'react';
import { shallow } from 'enzyme';

import AddOnsCard from '../AddOnsCard';
import AddOnsConstants from '../../AddOnsConstants';

describe('<AddOnsCard />', () => {
  let wrapper;
  let onClick;
  beforeEach(() => {
    onClick = jest.fn();
    wrapper = shallow(
      <AddOnsCard
        addOn={{
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
          enabled: true,
          has_external_resources: false,
          hidden: false,
          id: 'dummy-id',
          kind: 'AddOn',
          label: 'api.openshift.com/dummy',
          name: 'Dummy Name',
          operator_name: 'dummy-operator',
          parameters: {
            items: [
              {
                id: 'dummy item',
                enabled: true,
              },
            ],
          },
        }}
        installedAddOn={{
          state: AddOnsConstants.INSTALLATION_STATE.READY,
        }}
        requirements={{ fulfilled: true, errorMsgs: [] }}
        onClick={onClick}
        activeCard="dummy-id"
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render reduced description to 60 char length', () => {
    const cardBodyDescription = wrapper.find('CardBody').props().children;
    expect(cardBodyDescription.length).toEqual(60);
  });

  it('should have a label that matches installed addon state', () => {
    const label = wrapper.find('AddOnStateLabel').props().installedAddOn.state;
    expect(label).toEqual('ready');
  });
});
