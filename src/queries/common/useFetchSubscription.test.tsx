import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { mockSubscriptionAxiosResponse } from '../__mocks__/queryMockedData';

import { useFetchSubscription } from './useFetchSubscription';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

const MAIN_QUERY_KEY = 'clusterDetails';

describe('useGetSubscription hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useSubscription valid response', async () => {
    const subscriptionID = 'your-subscription-id';

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce({ data: mockSubscriptionAxiosResponse });
    // Render the hook
    const { result } = renderHook(() => useFetchSubscription(subscriptionID, MAIN_QUERY_KEY));

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
    expect(result.current.data?.subscription.cluster_id).toEqual(
      mockSubscriptionAxiosResponse.cluster_id,
    );
  });

  it('Get useSubscription network error response', async () => {
    const subscriptionID = 'your-subscription-id';

    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'Account with ID 123456 denied access to perform get on Subscription with HTTP',
    });
    // Render the hook
    const { result } = renderHook(() => useFetchSubscription(subscriptionID, MAIN_QUERY_KEY));

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
    expect(result.current.error?.message).toEqual(
      'Account with ID 123456 denied access to perform get on Subscription with HTTP',
    );
  });
});
