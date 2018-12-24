import { cloudProviderConstants } from '../constants';
import { clusterService } from '../../services';

const getCloudProvidersAndRegions = () => clusterService.getCloudProviders().then(
  (cloudProvidersResponse) => {
    const cloudProviders = {};
    const promises = [];
    cloudProvidersResponse.data.items.forEach((provider) => {
      cloudProviders[provider.id] = provider;
      promises.push(
        clusterService.getCloudRegions(provider.id).then((response) => {
          // build a map of region id -> region info
          const regions = {};
          response.data.items.forEach((region) => {
            regions[region.id] = region;
          });
          cloudProviders[provider.id].regions = regions;
        }),
      );
    });
    return Promise.all(promises).then(() => cloudProviders);
  },
);


const getCloudProviders = () => dispatch => dispatch({
  type: cloudProviderConstants.GET_CLOUD_PROVIDERS,
  payload: getCloudProvidersAndRegions(),
});

const cloudProviderActions = { getCloudProviders };

export { cloudProviderActions, getCloudProviders };
