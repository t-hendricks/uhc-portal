import {
  SET_FEATURE,
  ASSISTED_INSTALLER_FEATURE,
  ASSISTED_INSTALLER_SNO_FEATURE,
  ASSISTED_INSTALLER_OCS_FEATURE,
  ASSISTED_INSTALLER_CNV_FEATURE,
  OSD_TRIAL_FEATURE,
  ASSISTED_INSTALLER_MERGE_LISTS_FEATURE,
  ASSISTED_INSTALLER_NETWORK_TYPE_SELECTION_FEATURE,
  ASSISTED_INSTALLER_PLATFORM_INTEGRATION_FEATURE,
  OSD_CREATION_WIZARD_FEATURE,
  ROSA_CREATION_WIZARD_FEATURE,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';

const setFeature = (feature, enabled) => ({
  type: SET_FEATURE,
  payload: { feature, enabled },
});

const getSimpleUnleashFeature = (unleashFeatureName, name) => ({
  name,
  action: () => authorizationsService.selfFeatureReview(unleashFeatureName)
    .then(unleash => unleash.data.enabled),
});

// list of features to detect upon app startup
export const features = [
  getSimpleUnleashFeature('osd-trial', OSD_TRIAL_FEATURE),
  getSimpleUnleashFeature('assisted-installer-sno', ASSISTED_INSTALLER_SNO_FEATURE),
  getSimpleUnleashFeature('assisted-installer-ocs', ASSISTED_INSTALLER_OCS_FEATURE),
  getSimpleUnleashFeature('assisted-installer-cnv', ASSISTED_INSTALLER_CNV_FEATURE),
  getSimpleUnleashFeature('assisted-installer-merge-lists', ASSISTED_INSTALLER_MERGE_LISTS_FEATURE),
  getSimpleUnleashFeature('assisted-installer-network-type-selection', ASSISTED_INSTALLER_NETWORK_TYPE_SELECTION_FEATURE),
  getSimpleUnleashFeature('assisted-installer-platform-integration', ASSISTED_INSTALLER_PLATFORM_INTEGRATION_FEATURE),
  getSimpleUnleashFeature('osd-creation-wizard', OSD_CREATION_WIZARD_FEATURE),
  getSimpleUnleashFeature('rosa-creation-wizard', ROSA_CREATION_WIZARD_FEATURE),
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: () => Promise.all([
      authorizationsService.selfAccessReview({ action: 'create', resource_type: 'BareMetalCluster' }),
      authorizationsService.selfFeatureReview('assisted-installer'),
    ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled),
  },
];

export const detectFeatures = () => (dispatch) => {
  features.forEach(({ name, action }) => action()
    .then(enabled => dispatch(setFeature(name, enabled)))
    .catch(() => dispatch(setFeature(name, false))));
};
