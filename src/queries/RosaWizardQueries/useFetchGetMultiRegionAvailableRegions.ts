import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { accountsService } from '~/services';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { CloudRegion } from '~/types/clusters_mgmt.v1';

import { currentEnvironment, formatErrorData, getProdRegionalInstances } from '../helpers';
import { queryConstants } from '../queriesConstants';
import { AvailableRegionalInstance, RegionalizedCloudRegion } from '../types';

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

export const useFetchGetMultiRegionAvailableRegions = () => {
  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_MULTI_REGION_AVAILABLE_REGIONS],
    queryFn: async () => {
      const createResponseForRegionalizedRegions = async () => {
        const result: RegionalizedCloudRegion[] = [];
        const currentEnv = currentEnvironment();
        const isProduction = currentEnv === 'production';

        const getRegionalInstancesResponse = await accountsService.getRegionalInstances();

        if (getRegionalInstancesResponse.status === 200) {
          const getRegionsItems = getRegionalInstancesResponse?.data?.items;

          const availableRegions = isProduction
            ? getProdRegionalInstances(getRegionsItems)
            : getRegionsItems?.filter(
                (regionItem: AvailableRegionalInstance) =>
                  regionItem.id?.includes(currentEnv) && regionItem?.cloud_provider_id === 'aws',
              );

          if (availableRegions?.length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const availableRegion of availableRegions) {
              const extractRegionName = isProduction
                ? availableRegion?.id?.substring(4)
                : availableRegion?.id?.match(/\.(.*)\./);
              const availableRegionName = isProduction ? extractRegionName : extractRegionName[1];

              const regionalService = getClusterServiceForRegion(availableRegion.id);

              try {
                // eslint-disable-next-line no-await-in-loop
                const regionalCloudProvidersResponse = await regionalService.getCloudProviders();

                const regionalCloudProvidersItems = regionalCloudProvidersResponse?.data?.items;

                regionalCloudProvidersItems?.forEach((provider: any) => {
                  if (provider.id === 'aws' && provider.regions !== undefined) {
                    const findOwnRegion = provider.regions.find(
                      (region: any) => region.id === availableRegionName,
                    );

                    if (findOwnRegion && findOwnRegion.supports_hypershift) {
                      const region = createRegionalizedCloudRegionEntry(findOwnRegion, true);
                      result.push(region);
                    }
                  }
                });
              } catch (error) {
                return result;
              }
            }
          }
        }

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
        const regionalInstanceCloudProviders = await createResponseForRegionalizedRegions();

        if (regionalInstanceCloudProviders.length > 0) {
          mergedRegions.push(...regionalInstanceCloudProviders);
        }

        if (globalCloudProviders.length > 0) {
          globalCloudProviders.forEach((region) => {
            // if the same region exists in both responses, use the regionalized one
            const isExistingRegionalizdRegion = regionalInstanceCloudProviders?.some(
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

export const refetchGetMultiRegionAvailableRegions = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_MULTI_REGION_AVAILABLE_REGIONS],
    exact: true,
  });
};
