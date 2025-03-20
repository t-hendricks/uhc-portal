import React from 'react';
import * as reactRedux from 'react-redux';

import { useFetchIDPsWithHTPUsers } from '~/queries/ClusterDetailsQueries/AccessControlTab/UserQueries/useFetchIDPsWithHTPUsers';
import { OCMUI_ENHANCED_HTPASSWRD } from '~/queries/featureGates/featureConstants';
import {
  checkAccessibility,
  mockUseFeatureGate,
  render,
  screen,
  userEvent,
  withState,
} from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import IDPSection from './IDPSection';

jest.mock('~/queries/ClusterDetailsQueries/useFetchClusterIdentityProviders', () => ({
  useFetchClusterIdentityProviders: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock(
  '~/queries/ClusterDetailsQueries/AccessControlTab/UserQueries/useFetchIDPsWithHTPUsers',
  () => ({
    useFetchIDPsWithHTPUsers: jest.fn(),
  }),
);

const baseIDPs = {
  clusterIDPList: [],
  pending: false,
  fulfilled: true,
  error: false,
};

const clusterUrls = {
  console: 'https://console-openshift-console.apps.test-liza.wiex.s1.devshift.org',
  api: 'https://api.test-liza.wiex.s1.devshift.org:6443',
};

const openModal = jest.fn();
const props = {
  cluster: fixtures.clusterDetails.cluster,
  idpActions: {
    list: true,
    delete: true,
  },
  clusterID: '1i4counta3holamvo1g5tp6n8p3a03bq',
  subscriptionID: '1msoogsgTLQ4PePjrTOt3UqvMzX',
  identityProviders: baseIDPs,
  clusterHibernating: false,
  isReadOnly: false,
  isHypershift: false,
  openModal,
  clusterUrls,
};

describe('<IDPSection />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const useFetchIDPSWithHTPUsersMock = useFetchIDPsWithHTPUsers;

  it('should render (no IDPs)', async () => {
    useFetchIDPSWithHTPUsersMock.mockReturnValue({
      clusterIdentityProviders: [],
      isLoading: false,
      isError: false,
    });
    const { container } = render(<IDPSection {...props} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);
    await checkAccessibility(container);
  });

  it('should render (IDPs pending)', async () => {
    useFetchIDPSWithHTPUsersMock.mockReturnValue({
      clusterIdentityProviders: [],
      isLoading: true,
      isError: false,
    });

    const { container } = render(<IDPSection {...props} />);
    expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBeGreaterThan(0);
    await checkAccessibility(container);
  });

  describe('should render (with IDPs)', () => {
    it('non-Hypershift cluster', async () => {
      useFetchIDPSWithHTPUsersMock.mockReturnValue({
        data: [
          {
            name: 'hello',
            type: 'GithubIdentityProvider',
            id: 'id1',
          },
          {
            name: 'hi',
            type: 'GoogleIdentityProvider',
            id: 'id2',
          },
        ],

        isLoading: false,
        isError: false,
      });
      const { container } = render(<IDPSection {...props} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);

      await checkAccessibility(container);
    });

    it('Hypershift cluster', async () => {
      useFetchIDPSWithHTPUsersMock.mockReturnValue({
        data: [
          {
            name: 'hello',
            type: 'GithubIdentityProvider',
            id: 'id1',
          },
          {
            name: 'hi',
            type: 'GoogleIdentityProvider',
            id: 'id2',
          },
        ],
        isLoading: false,
        isError: false,
      });
      const newProps = { ...props, isHypershift: true };
      const { container } = render(<IDPSection {...newProps} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);
      await checkAccessibility(container);
    });

    it('displays expandable section with htpasswd users', async () => {
      mockUseFeatureGate([[OCMUI_ENHANCED_HTPASSWRD, true]]);
      useFetchIDPSWithHTPUsersMock.mockReturnValue({
        data: [
          {
            name: 'hello',
            type: 'HTPasswdIdentityProvider',
            id: 'id1',
            htpUsers: [
              {
                kind: 'HTPasswdUser',
                id: 'userId1',
                username: 'user1',
              },
              {
                kind: 'HTPasswdUser',
                id: 'userId2',
                username: 'user2',
              },
              {
                kind: 'HTPasswdUser',
                id: 'userId3',
                username: 'user3',
              },
            ],
          },
          {
            name: 'hi',
            type: 'HTPasswdIdentityProvider',
            id: 'id2',
          },
        ],
        isLoading: false,
        isError: false,
      });

      const { container } = render(<IDPSection {...props} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();

      const expandRowToggle = screen.getByTestId('expandable-row');
      expect(expandRowToggle).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);
      await checkAccessibility(container);
    });

    it('should call open delete IDP modal', async () => {
      const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
      const mockedDispatch = jest.fn();
      useDispatchMock.mockReturnValue(mockedDispatch);

      useFetchIDPSWithHTPUsersMock.mockReturnValue({
        data: [
          {
            name: 'hello',
            type: 'GithubIdentityProvider',
            id: 'id1',
          },
        ],

        isLoading: false,
        isError: false,
      });

      const initialState = {
        modal: {
          modalName: 'delete-idp',
          data: {
            clusterID: 'myclusterid',
            idpId: 'id1',
            idpName: 'hello',
            idpType: 'GithubIdentityProvider',
          },
        },
      };

      withState(initialState, true).render(<IDPSection {...props} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();
      const toggleKebab = screen.getByLabelText('Kebab toggle');
      await userEvent.click(toggleKebab);

      const deleteBtn = screen.getByRole('menuitem', { name: 'Delete' });

      await userEvent.click(deleteBtn);

      expect(mockedDispatch).toHaveBeenCalledWith({
        error: undefined,
        meta: undefined,
        type: 'OPEN_MODAL',
        payload: {
          data: {
            clusterID: '1i4counta3holamvo1g5tp6n8p3a03bq',
            idpID: 'id1',
            idpName: 'hello',
            idpType: 'GitHub',
            region: undefined,
          },
          name: 'delete-idp',
        },
      });
    });
  });
});
