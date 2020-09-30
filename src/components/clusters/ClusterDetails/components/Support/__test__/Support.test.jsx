import React from 'react';
import { shallow } from 'enzyme';

import Support from '../Support';

import { notificationContactsWithContacts } from './Support.fixtures';

describe('<Support /> should render', () => {
  it('without notification contacts', () => {
    const wrapper = shallow(<Support
      subscriptionID="1iGW3xYbKZAEdZLi207rcA1l0ob"
      canEdit
      notificationContacts={{
        contacts: [],
        pending: false,
        subscriptionID: '',
      }}
      deleteContactResponse={{}}
      addContactResponse={{}}
      getNotificationContacts={jest.fn()}
      hasContacts={false}
      deleteNotificationContact={jest.fn()}
      clearDeleteNotificationContacts={jest.fn()}
      clearNotificationContacts={jest.fn()}
      addNotificationToaster={jest.fn()}
      isAddNotificationContactModalOpen={false}
      openModal={jest.fn()}
      closeModal={jest.fn()}
      clearAddNotificationContacts={jest.fn()}
      addNotificationContact={jest.fn()}
    />);

    expect(wrapper)
      .toMatchSnapshot();
  });

  it('with notification contacts', () => {
    const wrapper = shallow(<Support
      subscriptionID="1iGW3xYbKZAEdZLi207rcA1l0ob"
      canEdit
      notificationContacts={notificationContactsWithContacts}
      deleteContactResponse={{}}
      addContactResponse={{}}
      getNotificationContacts={jest.fn()}
      hasContacts={false}
      deleteNotificationContact={jest.fn()}
      clearDeleteNotificationContacts={jest.fn()}
      clearNotificationContacts={jest.fn()}
      addNotificationToaster={jest.fn()}
      isAddNotificationContactModalOpen={false}
      openModal={jest.fn()}
      closeModal={jest.fn()}
      clearAddNotificationContacts={jest.fn()}
      addNotificationContact={jest.fn()}
    />);

    expect(wrapper)
      .toMatchSnapshot();
  });
});
