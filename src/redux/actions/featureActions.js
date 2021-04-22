import {
  SET_FEATURE,
  ASSISTED_INSTALLER_FEATURE,
  ASSISTED_INSTALLER_SNO_FEATURE,
  ASSISTED_INSTALLER_OCS_FEATURE,
  ASSISTED_INSTALLER_CNV_FEATURE,
  OSD_TRIAL_FEATURE,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';
import accountsService from '../../services/accountsService';

const setFeature = (feature, enabled) => ({
  type: SET_FEATURE,
  payload: { feature, enabled },
});

const getSimpleUnleashFeature = (unleashFeatureName, name) => ({
  name,
  action: organizationID => accountsService.getFeature(unleashFeatureName, organizationID)
    .then(unleash => unleash.data.enabled),
});

// list of features to detect upon app startup
export const features = [
  getSimpleUnleashFeature('osd-trial', OSD_TRIAL_FEATURE),
  getSimpleUnleashFeature('assisted-installer-sno', ASSISTED_INSTALLER_SNO_FEATURE),
  getSimpleUnleashFeature('assisted-installer-ocs', ASSISTED_INSTALLER_OCS_FEATURE),
  getSimpleUnleashFeature('assisted-installer-cnv', ASSISTED_INSTALLER_CNV_FEATURE),
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: organizationID => Promise.all([
      authorizationsService.selfAccessReview({ action: 'create', resource_type: 'BareMetalCluster' }),
      accountsService.getFeature('assisted-installer', organizationID),
    ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled),
  },
];

export const detectFeatures = () => (dispatch) => {
  accountsService.getCurrentAccount().then((resp) => {
    const organizationID = resp?.data?.organization?.id;
    if (!organizationID) {
      console.error('No organization ID - all feature toggles disabled');
      features.forEach(({ name }) => dispatch(setFeature(name, false)));
    } else {
      features.forEach(({ name, action }) => action(organizationID)
        .then(enabled => dispatch(setFeature(name, enabled)))
        .catch(() => dispatch(setFeature(name, false))));
    }
  });
};
