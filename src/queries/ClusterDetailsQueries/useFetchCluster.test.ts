import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { mockedCluster, mockSubscriptionData } from '../__mocks__/queryMockedData';

import { useFetchCluster } from './useFetchCluster';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

const MAIN_QUERY_KEY = 'clusterDetails';

describe('useFetchCluster hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useGetClusterDetails valid response', async () => {
    const clusterID = 'mockedClusterID';
    const isAROCluster = false;

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce({ data: mockedCluster });

    const { result } = renderHook(() =>
      useFetchCluster(clusterID, mockSubscriptionData, isAROCluster, MAIN_QUERY_KEY),
    );

    // Initial loading state
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data?.data.kind).toEqual(mockedCluster.kind);
  });

  it('Get useGetClusterDetails error response', async () => {
    const clusterID = 'mockedClusterID';
    const isAROCluster = false;
    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'Cluster does not exist',
    });
    // Render the hook
    const { result } = renderHook(() =>
      useFetchCluster(clusterID, mockSubscriptionData, isAROCluster, MAIN_QUERY_KEY),
    );

    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.name).toEqual(403);
    expect(result.current.error?.message).toEqual('Cluster does not exist');
  });
});
