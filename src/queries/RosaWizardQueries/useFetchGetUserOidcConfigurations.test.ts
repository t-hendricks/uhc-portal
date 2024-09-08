import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { mockedOidcConfigurations } from '../__mocks__/queryMockedData';

import { useFetchGetUserOidcConfigurations } from './useFetchGetUserOidcConfigurations';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchGetUserOidcConfigurations hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useGetUserOidcConfigurations valid response', async () => {
    const awsAccountId = 'mockedAccountId';

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce(mockedOidcConfigurations);
    const { result } = renderHook(() =>
      useFetchGetUserOidcConfigurations(awsAccountId, undefined, true),
    );

    expect(result.current.isFetching).toBe(true);

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockedOidcConfigurations);
  });

  it('Get useGetUserOidcConfigurations error response', async () => {
    const awsAccountId = 'mockedAccountId';

    // Mock the network request using axios
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'No data',
    });
    const { result } = renderHook(() =>
      useFetchGetUserOidcConfigurations(awsAccountId, undefined, true),
    );

    expect(result.current.isFetching).toBe(true);

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(true);
  });
});
