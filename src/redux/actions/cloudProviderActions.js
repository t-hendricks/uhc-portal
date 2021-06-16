import { cloudProviderConstants } from '../constants';
import { clusterService } from '../../services';

const getCloudProvidersAndRegions = () => clusterService.getCloudProviders().then(
  (cloudProvidersResponse) => {
    const cloudProviders = {};
    cloudProvidersResponse.data.items.forEach((provider) => {
      cloudProviders[provider.id] = provider;
      // build a map of region id -> region info
      const regions = {};
      if (provider.regions !== undefined) {
        provider.regions.forEach((region) => {
          regions[region.id] = {
            // explicitly keeping only the fields we care about,
            // to avoid memory bloat with useless "Kind" and "href"
            id: region.id,
            display_name: region.display_name,
            enabled: region.enabled,
            supports_multi_az: region.supports_multi_az,
            kms_specific_region: region.kms_location_id,
            ccs_only: region.ccs_only,
          };
        });
      }
      cloudProviders[provider.id].regions = regions;
    });
    return cloudProviders;
  },
);

const getCloudProviders = () => dispatch => dispatch({
  type: cloudProviderConstants.GET_CLOUD_PROVIDERS,
  payload: getCloudProvidersAndRegions(),
});

const cloudProviderActions = { getCloudProviders };

export { cloudProviderActions, getCloudProviders };
