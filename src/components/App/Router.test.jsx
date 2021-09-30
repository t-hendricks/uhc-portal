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
  '/details/:id',
  '/details/s/:id',
  '/details/s/:id/add-idp/:idpTypeName',
  '/details/s/:id/edit-idp/:idpName',
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
