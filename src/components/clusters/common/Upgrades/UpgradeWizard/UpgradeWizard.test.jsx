import React from 'react';
import * as reactRedux from 'react-redux';

import { checkAccessibility, render, screen, waitFor, withState } from '~/testUtils';

import { useFetchClusterDetails } from '../../../../../queries/ClusterDetailsQueries/useFetchClusterDetails';
import fixtures from '../../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import UpgradeWizard from './UpgradeWizard';

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
}));

jest.mock('../../../../../queries/ClusterDetailsQueries/useFetchClusterDetails', () => ({
  useFetchClusterDetails: jest.fn(),
  invalidateClusterDetailsQueries: jest.fn(),
}));

const initialState = {
  modal: {
    data: {
      clusterName: 'myClusterName',
      subscriptionID: 'mySubscriptionId',
    },
  },

  selectedVersion: undefined,
};

describe('<UpgradeWizard />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);
  const mockedUseFetchClusterDetails = useFetchClusterDetails;

  const defaultClusterDetailsResponse = {
    isLoading: false,
    isSuccess: true,
    cluster: fixtures.clusterDetails.cluster,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    mockedUseFetchClusterDetails.mockReturnValue(defaultClusterDetailsResponse);
    const { container } = render(<UpgradeWizard />);

    await checkAccessibility(container);
  });

  it('displays spinner when loading', async () => {
    mockedUseFetchClusterDetails.mockReturnValue({
      isLoading: true,
      isSuccess: null,
      cluster: undefined,
    });

    withState(initialState, true).render(<UpgradeWizard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays the cluster name', async () => {
    mockedUseFetchClusterDetails.mockReturnValue(defaultClusterDetailsResponse);

    withState(initialState, true).render(<UpgradeWizard />);

    expect(screen.getByText('myClusterName')).toBeInTheDocument();
  });

  it('calls close modal when cancelling', async () => {
    mockedUseFetchClusterDetails.mockReturnValue(defaultClusterDetailsResponse);

    const { user } = withState(initialState, true).render(<UpgradeWizard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    expect(mockedDispatch).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
  });

  it('Next is disabled when no version is selected', async () => {
    mockedUseFetchClusterDetails.mockReturnValue(defaultClusterDetailsResponse);

    withState(initialState, true).render(<UpgradeWizard />);

    const nextButton = screen.getByRole('button', { name: 'Next' });

    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });

    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('displays the appropriate steps', async () => {
    mockedUseFetchClusterDetails.mockReturnValue(defaultClusterDetailsResponse);

    withState(initialState, true).render(<UpgradeWizard />);

    expect(screen.getByRole('button', { name: 'Select version' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schedule update' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmation' })).toBeInTheDocument();
  });
});
