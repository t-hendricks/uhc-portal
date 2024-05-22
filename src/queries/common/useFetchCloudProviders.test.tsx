import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useFetchCloudProviders } from './useFetchCloudProviders';

const apiResponse = {
  kind: 'CloudProviderList',
  page: 1,
  size: 1,
  items: [
    {
      kind: 'CloudProvider',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      name: 'aws',
      display_name: 'AWS',
      regions: [
        {
          kind: 'CloudRegion',
          id: 'af-south-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/af-south-1',
          display_name: 'Africa (Cape Town)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          enabled: true,
          supports_multi_az: true,
          kms_location_name: '',
          kms_location_id: '',
          ccs_only: true,
          govcloud: false,
          supports_hypershift: false,
        },
        {
          kind: 'CloudRegion',
          id: 'ap-east-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-east-1',
          display_name: 'Asia Pacific (Hong Kong)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          enabled: true,
          supports_multi_az: true,
          kms_location_name: '',
          kms_location_id: '',
          ccs_only: true,
          govcloud: false,
          supports_hypershift: false,
        },
      ],
    },
  ],
};

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchCloudProviders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('returns cloudProviders in expected format', async () => {
    apiRequestMock.get.mockResolvedValue({ data: apiResponse });
    const { result } = renderHook(() => useFetchCloudProviders());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    const expected = {
      aws: {
        kind: 'CloudProvider',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        name: 'aws',
        display_name: 'AWS',
        regions: {
          'af-south-1': {
            id: 'af-south-1',
            display_name: 'Africa (Cape Town)',
            enabled: true,
            supports_multi_az: true,
            kms_location_id: '',
            ccs_only: true,
            supports_hypershift: false,
          },
          'ap-east-1': {
            id: 'ap-east-1',
            display_name: 'Asia Pacific (Hong Kong)',
            enabled: true,
            supports_multi_az: true,
            kms_location_id: '',
            ccs_only: true,
            supports_hypershift: false,
          },
        },
      },
    };

    expect(result.current.data).toEqual(expected);
  });
});
