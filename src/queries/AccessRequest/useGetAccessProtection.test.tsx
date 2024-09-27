import type axios from 'axios';

import { ACCESS_REQUEST_ENABLED } from '~/redux/constants/featureConstants';
import apiRequest from '~/services/apiRequest';
import { mockUseFeatureGate, renderHook, waitFor } from '~/testUtils';

import { useGetAccessProtection } from './useGetAccessProtection';

const apiResponse = {
  enabled: true,
};

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useGetAccessProtection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected data', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, true]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetAccessProtection({
        subscriptionId: 'mySubscriptionId',
        organizationId: 'myOrgId',
        clusterId: 'myClusterId',
      }),
    );

    await waitFor(() => {
      expect(result.current.enabled).not.toBeUndefined();
    });

    expect(result.current.enabled).toBeTruthy();
    expect(result.current.isPending).toBeFalsy();

    const expectedParams = {
      params: {
        subscriptionId: 'mySubscriptionId',
        organizationId: 'myOrgId',
        clusterId: 'myClusterId',
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });

  it('does not make API call if all params are missing', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, true]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() => useGetAccessProtection({ subscriptionId: undefined }));

    await waitFor(() => {
      expect(result.current.isLoading).not.toBeUndefined();
    });

    expect(result.current.isFetched).toBeFalsy();
    expect(result.current.enabled).toBeUndefined();
    expect(result.current.isPending).toBeTruthy();

    expect(apiRequestMock.get).not.toHaveBeenCalled();
  });

  it('does not make API call if feature gate is turned off', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, false]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetAccessProtection({ subscriptionId: 'mySubscriptionId' }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).not.toBeUndefined();
    });

    expect(result.current.isFetched).toBeFalsy();
    expect(result.current.enabled).toBeUndefined();
    expect(result.current.isPending).toBeTruthy();

    expect(apiRequestMock.get).not.toHaveBeenCalled();
  });

  it('makes api call with only subscription id', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, true]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetAccessProtection({
        subscriptionId: 'mySubscriptionId',
      }),
    );

    await waitFor(() => {
      expect(result.current.enabled).not.toBeUndefined();
    });

    expect(result.current.enabled).toBeTruthy();
    expect(result.current.isPending).toBeFalsy();

    const expectedParams = {
      params: {
        subscriptionId: 'mySubscriptionId',
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });

  it('makes api call with only organization id', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, true]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetAccessProtection({
        organizationId: 'myOrgId',
      }),
    );

    await waitFor(() => {
      expect(result.current.enabled).not.toBeUndefined();
    });

    expect(result.current.enabled).toBeTruthy();
    expect(result.current.isPending).toBeFalsy();

    const expectedParams = {
      params: {
        organizationId: 'myOrgId',
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });

  it('makes api call with only cluster id', async () => {
    mockUseFeatureGate([[ACCESS_REQUEST_ENABLED, true]]);
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetAccessProtection({
        clusterId: 'myClusterId',
      }),
    );

    await waitFor(() => {
      expect(result.current.enabled).not.toBeUndefined();
    });

    expect(result.current.enabled).toBeTruthy();
    expect(result.current.isPending).toBeFalsy();

    const expectedParams = {
      params: {
        clusterId: 'myClusterId',
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });
});
