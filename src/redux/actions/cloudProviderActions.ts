import { action, ActionType } from 'typesafe-actions';
import { cloudProviderConstants } from '../constants';
import { clusterService } from '../../services';
import type { CloudProvider, CloudRegion } from '../../types/clusters_mgmt.v1';
import type { AppThunk } from '../types';

const getCloudProvidersAndRegions = () =>
  clusterService.getCloudProviders().then((cloudProvidersResponse) => {
    const cloudProviders: {
      [providerId: string]: Omit<CloudProvider, 'regions'> & {
        regions: { [id: string]: CloudRegion };
      };
    } = {};
    cloudProvidersResponse.data.items?.forEach((provider) => {
      if (provider.id) {
        // build a map of region id -> region info
        const regions: { [id: string]: CloudRegion } = {};
        if (provider.regions !== undefined) {
          provider.regions.forEach((region) => {
            if (region.id) {
              regions[region.id] = {
                // explicitly keeping only the fields we care about,
                // to avoid memory bloat with useless "Kind" and "href"
                id: region.id,
                display_name: region.display_name,
                enabled: region.enabled,
                supports_multi_az: region.supports_multi_az,
                kms_location_id: region.kms_location_id,
                ccs_only: region.ccs_only,
              };
            }
          });
        }
        cloudProviders[provider.id] = {
          ...provider,
          regions,
        };
      }
    });
    return cloudProviders;
  });

const getCloudProvidersAction = () =>
  action(cloudProviderConstants.GET_CLOUD_PROVIDERS, getCloudProvidersAndRegions());

const getCloudProviders = (): AppThunk => (dispatch) => dispatch(getCloudProvidersAction());

const cloudProviderActions = { getCloudProviders };

type CloudProviderAction = ActionType<typeof getCloudProvidersAction>;

export { cloudProviderActions, getCloudProviders, CloudProviderAction };
