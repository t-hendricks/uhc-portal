import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { CloudRegion } from '~/types/clusters_mgmt.v1';
import { StaticRegionalItems } from '~/types/types';

import staticRegionalInstances from '../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/static_regional_instances.json';
import { formatErrorData, formatRegionalInstanceUrl } from '../helpers';
import { queryConstants } from '../queriesConstants';
import { RegionalizedCloudRegion } from '../types';

const createRegionalizedCloudRegionEntry = (cloudRegion: CloudRegion, isRegionalized: boolean) => {
  const region: RegionalizedCloudRegion = {
    id: cloudRegion.id,
    display_name: cloudRegion.display_name,
    enabled: cloudRegion.enabled,
    supports_multi_az: cloudRegion.supports_multi_az,
    kms_location_id: cloudRegion.kms_location_id,
    ccs_only: cloudRegion.ccs_only,
    supports_hypershift: cloudRegion.supports_hypershift,
    is_regionalized: isRegionalized,
  };
  return region;
};

export const useFetchRegionalizedMultiRegions = () => {
  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_REGIONALIZED_MULTI_REGIONS],
    queryFn: async () => {
      const regionalInstances = staticRegionalInstances as StaticRegionalItems;

      const createResponseForRegionalizedRegions = async (
        regionalInstances: StaticRegionalItems,
      ) => {
        const regionalInstancesArray = Object.entries(regionalInstances);
        const result: RegionalizedCloudRegion[] = [];

        await Promise.all(
          regionalInstancesArray.map(async (instance) => {
            const regionKey = instance[0];
            const findInstanceUrl = instance.find(
              (value): value is { url: string } => typeof value === 'object' && 'url' in value,
            );

            const requestUrl = findInstanceUrl?.url
              ? formatRegionalInstanceUrl(findInstanceUrl.url)
              : undefined;

            const service = getClusterServiceForRegion(requestUrl);
            const response = await service.getCloudProviders();

            response.data.items?.forEach((provider) => {
              if (provider.id === 'aws' && provider.regions !== undefined) {
                const findOwnRegion = provider.regions.find((region) => region.id === regionKey);

                if (findOwnRegion && findOwnRegion.supports_hypershift) {
                  const region = createRegionalizedCloudRegionEntry(findOwnRegion, true);

                  result.push(region);
                }
              }
            });
          }),
        );
        return result;
      };

      const createResponseForGlobalRegions = async () => {
        const result: RegionalizedCloudRegion[] = [];
        const response = await clusterService.getCloudProviders();

        response.data.items?.forEach((provider) => {
          if (provider.id === 'aws' && provider.regions !== undefined) {
            provider.regions.forEach((cloudRegion) => {
              if (cloudRegion.id && cloudRegion.supports_hypershift) {
                const region = createRegionalizedCloudRegionEntry(cloudRegion, false);

                result.push(region);
              }
            });
          }
        });
        return result;
      };

      const createMergedRegions = async () => {
        const mergedRegions: RegionalizedCloudRegion[] = [];
        const globalCloudProviders = await createResponseForGlobalRegions();
        const regionalInstanceCloudProviders =
          await createResponseForRegionalizedRegions(regionalInstances);

        if (regionalInstanceCloudProviders) {
          mergedRegions.push(...regionalInstanceCloudProviders);
        }

        if (globalCloudProviders) {
          globalCloudProviders.forEach((region) => {
            // if the same region exists in both responses, use the regionalized one
            const isExistingRegionalizdRegion = regionalInstanceCloudProviders.some(
              (regionalInstanceRegion) => regionalInstanceRegion.id === region.id,
            );
            if (!isExistingRegionalizdRegion) mergedRegions.push(region);
          });
        }

        return mergedRegions;
      };

      return createMergedRegions();
    },
    retry: false,
  });

  const errorData = formatErrorData(isLoading, isError, error);

  return {
    data,
    error: errorData?.error,
    isError,
    isFetching,
    isSuccess,
  };
};

export const refetchRegionalizedMultiRegions = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_REGIONALIZED_MULTI_REGIONS],
    exact: true,
  });
};
