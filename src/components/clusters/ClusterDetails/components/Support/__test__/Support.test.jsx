import React from 'react';
import { shallow } from 'enzyme';

import Support from '../Support';
import NotificationContactsCard from '../components/NotificationContactsSection/NotificationContactsCard';
import SupportCasesCard from '../components/SupportCasesSection/SupportCasesCard';
import { notificationContactsWithContacts, baseProps } from './Support.fixtures';

describe('<Support /> should render', () => {
  it('without notification contacts', () => {
    const wrapper = shallow(<Support
      {...baseProps}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('with notification contacts', () => {
    const wrapper = shallow(<Support
      {...baseProps}
      notificationContacts={notificationContactsWithContacts}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('<Support isDisabled/>', () => {
  it('should have the components disabled', () => {
    const wrapper = shallow(<Support
      {...baseProps}
      isDisabled
    />);
    expect(wrapper.find('AddNotificationContactButton').length).toEqual(0);
    expect(wrapper.find('Connect(NotificationContactsCard)').props().isDisabled).toBe(true);
    expect(wrapper.find('Connect(SupportCasesCard)').props().isDisabled).toBe(true);
  });
});

describe('<NotificationContactsCard isDisabled/>', () => {
  it('should have the components disabled', () => {
    const wrapper = shallow(<NotificationContactsCard
      {...baseProps}
      hasContacts
      isDisabled
    />);
    expect(wrapper.find('Table').props().areActionsDisabled()).toBe(true);
  });
});

describe('<SupportCasesCard isDisabled/>', () => {
  it('should have the components disabled', () => {
    const wrapper = shallow(<SupportCasesCard
      {...baseProps}
      clusterUUID="1"
      product="OSD"
      isDisabled
    />);
    expect(wrapper.find('Button').length).toEqual(0);
  });
});
