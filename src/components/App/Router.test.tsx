import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { mockRestrictedEnv, mockUseChrome, render, screen } from '~/testUtils';

import Router from './Router';

const routes = [
  { path: '/', metadata: { ocm_resource_type: 'all' } },
  { path: '/token/rosa', metadata: { ocm_resource_type: 'moa' } },
  { path: '/token/rosa/show', metadata: { ocm_resource_type: 'moa' } },
  { path: '/details/:id', metadata: { ocm_resource_type: 'all' } },
  {
    path: '/details/s/:id',
    metadata: { ocm_resource_type: 'unknown', title: 'View Cluster', path: '/openshift/details/s' },
  },
  {
    path: '/details/s/:id/add-idp/:idpTypeName',
    metadata: {
      ocm_resource_type: 'unknown',
      title: 'Add IdP',
      path: '/openshift/details/s/add-idp',
    },
  },
  {
    path: '/details/s/:id/edit-idp/:idpName',
    metadata: {
      ocm_resource_type: 'unknown',
      title: 'Edit IdP',
      path: '/openshift/details/s/edit-idp',
    },
  },
  { path: '/create/osd/aws', metadata: { ocm_resource_type: 'osd' } },
  { path: '/create/osd/gcp', metadata: { ocm_resource_type: 'osd' } },
  { path: '/create/osd', metadata: { ocm_resource_type: 'osd' } },
  { path: '/register', metadata: { ocm_resource_type: 'ocp' } },
  { path: '/archived', metadata: { ocm_resource_type: 'all' } },
];

const routesWithLoading = [
  { path: '/token', metadata: { ocm_resource_type: 'all' } },
  { path: '/token/show', metadata: { ocm_resource_type: 'all' } },
  { path: '/downloads', metadata: { ocm_resource_type: 'all' } },
  { path: '/quota', metadata: { ocm_resource_type: 'all' } },
];

const createRoute = [{ path: '/create', metadata: { ocm_resource_type: 'all' } }];

const releasesRoute = [{ path: '/releases', metadata: { ocm_resource_type: 'ocp' } }];

describe('Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  mockRestrictedEnv();
  const mockSetPageMetadata = jest.fn();
  mockUseChrome({
    segment: {
      setPageMetadata: mockSetPageMetadata,
    },
  });

  describe('Every route should render: ', () => {
    test.each(routes)('%s', async (route) => {
      const { path, metadata } = route;
      render(
        <MemoryRouter keyLength={0} initialEntries={[{ pathname: path, key: 'testKey' }]}>
          <CompatRouter>
            <Router />
          </CompatRouter>
        </MemoryRouter>,
      );

      // These pages can't actually fully render because the state isn't mocked
      // That's OK - for these tests we want to ensure that the route goes somewhere
      await screen.findByText('This page is temporarily unavailable');
      expect(screen.queryByText('We lost that page')).not.toBeInTheDocument();

      expect(mockSetPageMetadata).toHaveBeenLastCalledWith(metadata);
    });

    test.each(routesWithLoading)('%s', async (route) => {
      const { path, metadata } = route;
      render(
        <MemoryRouter keyLength={0} initialEntries={[{ pathname: path, key: 'testKey' }]}>
          <CompatRouter>
            <Router />
          </CompatRouter>
        </MemoryRouter>,
      );

      await screen.findByText('Loading...');
      expect(screen.queryByText('We lost that page')).not.toBeInTheDocument();

      expect(mockSetPageMetadata).toHaveBeenLastCalledWith(metadata);
    });

    test.each(createRoute)('%s', async (route) => {
      const { path, metadata } = route;
      render(
        <MemoryRouter keyLength={0} initialEntries={[{ pathname: path, key: 'testKey' }]}>
          <CompatRouter>
            <Router />
          </CompatRouter>
        </MemoryRouter>,
      );

      await screen.findByText('Download pull secret');
      expect(screen.queryByText('We lost that page')).not.toBeInTheDocument();

      expect(mockSetPageMetadata).toHaveBeenLastCalledWith(metadata);
    });

    test.each(releasesRoute)('%s', async (route) => {
      const { path, metadata } = route;
      render(
        <MemoryRouter keyLength={0} initialEntries={[{ pathname: path, key: 'testKey' }]}>
          <CompatRouter>
            <Router />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(screen.queryByText('We lost that page')).not.toBeInTheDocument();

      expect(mockSetPageMetadata).toHaveBeenLastCalledWith(metadata);
    });
  });
});
