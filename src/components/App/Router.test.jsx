import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import Router from './Router';
import { store } from '../../redux/store';

jest.mock('../../services/apiRequest.js');

global.insights = {
  chrome: {
    on: () => () => {}, // a function that returns a function
    appNavClick: () => {},
    auth: {
      getOfflineToken: () => Promise.resolve({ data: { refresh_token: 'hello' } }),
    },
  },
};

const routes = [
  '/',
  '/token/rosa',
  '/token',
  '/create/aws/installer-provisioned',
  '/create/aws/user-provisioned',
  '/create/aws',
  '/create/gcp/installer-provisioned',
  '/create/gcp/user-provisioned',
  '/create/gcp',
  '/create/openstack/installer-provisioned',
  '/create/openstack/user-provisioned',
  '/create/openstack',
  '/create/rhv',
  '/create/rhv/installer-provisioned',
  '/create/rhv/user-provisioned',
  '/create/azure/installer-provisioned',
  '/create/azure/user-provisioned',
  '/create/azure',
  '/create/metal',
  '/create/metal/user-provisioned',
  '/create/metal/installer-provisioned',
  '/create/vsphere/user-provisioned',
  '/create/ibmz/user-provisioned',
  '/create/power/user-provisioned',
  '/create/pre-release',
  '/create/pull-secret',
  '/create/azure/aro-provisioned',
  '/details/:id',
  '/details/s/:id',
  '/create/osd/aws',
  '/create/osd/gcp',
  '/create/osd',
  '/create',
  '/register',
  '/subscriptions',
  '/archived',
];

describe('Every route should render: ', () => test.each(routes)('%s', (route) => {
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: route, key: 'testKey' }]}>
        <Router />
      </MemoryRouter>
    </Provider>,
  );
  expect(wrapper).toBeTruthy();
}, 20000));
