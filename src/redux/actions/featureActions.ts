import { action, ActionType } from 'typesafe-actions';
import { Capability } from '~/types/accounts_mgmt.v1/models/Capability';
import {
  SET_FEATURE,
  ASSISTED_INSTALLER_PLATFORM_OCI,
  ASSISTED_INSTALLER_FEATURE,
  ASSISTED_INSTALLER_MERGE_LISTS_FEATURE,
  HYPERSHIFT_WIZARD_FEATURE,
  OSD_GOOGLE_MARKETPLACE_FEATURE,
  HCP_ROSA_GETTING_STARTED_PAGE,
  HCP_AWS_BILLING_SHOW,
  HCP_AWS_BILLING_REQUIRED,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';
import accountsService from '../../services/accountsService';
import { SelfAccessReview } from '../../types/authorizations.v1/models/SelfAccessReview';
import type { AppThunk } from '../types';

export const setFeatureAction = (feature: string, enabled: boolean) =>
  action(SET_FEATURE, { feature, enabled });

const getSimpleUnleashFeature = (unleashFeatureName: string, name: string) => ({
  name,
  action: () =>
    authorizationsService
      .selfFeatureReview(unleashFeatureName)
      .then((unleash) => unleash.data.enabled),
});

type MapCapabilityToAssistedInstallerFeatureFunc = {
  (capabilityName: string): Promise<boolean>;
  cache?: Map<string, Capability[]>;
};

const mapCapabilityToAssistedInstallerFeature: MapCapabilityToAssistedInstallerFeatureFunc = async (
  capabilityName: string,
) => {
  if (!mapCapabilityToAssistedInstallerFeature.cache) {
    mapCapabilityToAssistedInstallerFeature.cache = new Map();
  }

  let isFeatureEnabled = false;
  const response = await accountsService.getCurrentAccount();
  const userOrganizationId = response.data?.organization?.id;
  if (userOrganizationId) {
    if (!mapCapabilityToAssistedInstallerFeature.cache.has(userOrganizationId)) {
      const organizationResponse = await accountsService.getOrganization(userOrganizationId);
      const organization = organizationResponse.data;
      mapCapabilityToAssistedInstallerFeature.cache.set(
        userOrganizationId,
        JSON.parse(JSON.stringify(organization.capabilities ?? [])) as Capability[],
      );
    }

    const capabilities = mapCapabilityToAssistedInstallerFeature.cache.get(userOrganizationId);
    const capabilityEntry = capabilities?.find(({ name }) => name === capabilityName);
    isFeatureEnabled = capabilityEntry?.value === 'true';
  }

  return isFeatureEnabled;
};

// list of features to detect upon app startup
export const features = [
  getSimpleUnleashFeature('hypershift-creation-wizard', HYPERSHIFT_WIZARD_FEATURE),
  getSimpleUnleashFeature('hcp-rosa-getting-started-page', HCP_ROSA_GETTING_STARTED_PAGE),
  getSimpleUnleashFeature('hcp-aws-billing-show', HCP_AWS_BILLING_SHOW),
  getSimpleUnleashFeature('hcp-aws-billing-required', HCP_AWS_BILLING_REQUIRED),
  getSimpleUnleashFeature('assisted-installer-merge-lists', ASSISTED_INSTALLER_MERGE_LISTS_FEATURE),
  getSimpleUnleashFeature('osd-google-marketplace', OSD_GOOGLE_MARKETPLACE_FEATURE),
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: () =>
      Promise.all([
        authorizationsService.selfAccessReview({
          action: SelfAccessReview.action.CREATE,
          // @ts-ignore 'BareMetalCluster' does not exist on SelfAccessReview.resource_type
          resource_type: 'BareMetalCluster',
        }),
        authorizationsService.selfFeatureReview('assisted-installer'),
      ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled),
  },
  {
    name: ASSISTED_INSTALLER_PLATFORM_OCI,
    action: async () =>
      mapCapabilityToAssistedInstallerFeature(
        'capability.organization.bare_metal_installer_platform_oci',
      ),
  },
];

export const detectFeatures = (): AppThunk => (dispatch) => {
  features.forEach(({ name, action: featureAction }) =>
    featureAction()
      .then((enabled) => dispatch(setFeatureAction(name, enabled)))
      .catch(() => dispatch(setFeatureAction(name, false))),
  );
};

export type FeatureAction = ActionType<typeof setFeatureAction>;
