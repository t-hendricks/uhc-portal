import React from 'react';
import { shallow } from 'enzyme';

import Support from '../Support';

import { notificationContactsWithContacts, clusterCreator } from './Support.fixtures';

describe('<Support /> should render', () => {
  const baseProps = {
    subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
    canEdit: true,
    notificationContacts: {
      contacts: [],
      pending: false,
      subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
    },
    supportCases: {
      cases: [],
      pending: false,
      subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
    },
    deleteContactResponse: {},
    addContactResponse: {},
    getNotificationContacts: jest.fn(),
    hasContacts: false,
    deleteNotificationContact: jest.fn(),
    clearDeleteNotificationContacts: jest.fn(),
    clearNotificationContacts: jest.fn(),
    addNotificationToaster: jest.fn(),
    isAddNotificationContactModalOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
    clearAddNotificationContacts: jest.fn(),
    addNotificationContact: jest.fn(),
    getSupportCases: jest.fn(),
    clusterCreator,
  };

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
