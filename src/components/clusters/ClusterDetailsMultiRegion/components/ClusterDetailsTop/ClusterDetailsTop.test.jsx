import React from 'react';
import * as reactRedux from 'react-redux';

import { render, screen } from '~/testUtils';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';

import ClusterDetailsTop from './ClusterDetailsTop';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const defaultProps = {
  cluster: { subscription: { status: SubscriptionCommonFieldsStatus.Archived }, canEdit: true },
  pending: false,
  clusterIdentityProviders: {},
  organization: {},
  error: false,
  errorMessage: '',
  children: null,
  canSubscribeOCP: true,
  canTransferClusterOwnership: true,
  canHibernateCluster: true,
  autoRefreshEnabled: true,
  toggleSubscriptionReleased: jest.fn(),
  showPreviewLabel: false,
  isClusterIdentityProvidersLoading: false,
  clusterIdentityProvidersError: false,
  isRefetching: false,
  gcpOrgPolicyWarning: '',
  regionalInstance: undefined,
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
  selectedCardTitle: undefined,
  refreshFunc: jest.fn(),
  region: undefined,
  hasNetworkOndemand: false,
};

describe('<ClusterDetailsTop />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('clicking on unarchive button bring up unarchive modal', async () => {
    const { user } = render(<ClusterDetailsTop {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Unarchive' }));
    expect(mockedDispatch).toHaveBeenCalled();
    const mockedCalledWith = mockedDispatch.mock.calls[0][0];

    expect(mockedCalledWith.type).toEqual('OPEN_MODAL');
    expect(mockedCalledWith.payload.name).toEqual('unarchive-cluster');
  });
});
