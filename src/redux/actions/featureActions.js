import {
  SET_FEATURE,
  ASSISTED_INSTALLER_FEATURE,
  SUPPORT_TAB_FEATURE,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';
import accountsService from '../../services/accountsService';

const setFeature = (feature, enabled) => ({
  type: SET_FEATURE,
  payload: { feature, enabled },
});

// list of features to detect upon app startup
export const features = [
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: organizationID => (organizationID ? Promise.all([
      authorizationsService.selfAccessReview({ action: 'create', resource_type: 'BareMetalCluster' }),
      accountsService.getFeature('assisted-installer', organizationID),
    ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled)
      : Promise.reject(Error('No organization'))),
  },
  {
    name: SUPPORT_TAB_FEATURE,
    action: organizationID => (organizationID
      ? accountsService.getFeature('support-tab', organizationID)
        .then(unleash => unleash.data.enabled)
      : Promise.reject(Error('No organization'))),
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
