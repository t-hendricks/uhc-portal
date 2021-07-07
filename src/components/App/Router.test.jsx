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
  '/token/rosa/show',
  '/token',
  '/token/show',
  '/downloads',
  '/install/aws/installer-provisioned',
  '/install/aws/user-provisioned',
  '/install/aws',
  '/install/gcp/installer-provisioned',
  '/install/gcp/user-provisioned',
  '/install/gcp',
  '/install/openstack/installer-provisioned',
  '/install/openstack/user-provisioned',
  '/install/openstack',
  '/install/rhv',
  '/install/rhv/installer-provisioned',
  '/install/rhv/user-provisioned',
  '/install/azure/installer-provisioned',
  '/install/azure/user-provisioned',
  '/install/azure',
  '/install/metal',
  '/install/metal/user-provisioned',
  '/install/metal/installer-provisioned',
  '/install/vsphere',
  '/install/vsphere/user-provisioned',
  '/install/vsphere/installer-provisioned',
  '/install/ibmz/user-provisioned',
  '/install/power/user-provisioned',
  '/install/pre-release',
  '/install/pull-secret',
  '/install/azure/aro-provisioned',
  '/details/:id',
  '/details/s/:id',
  '/create/osd/aws',
  '/create/osd/gcp',
  '/create/osd',
  '/create',
  '/register',
  '/quota',
  '/archived',
  '/releases',
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
