import { SET_FEATURE, ASSISTED_INSTALLER_FEATURE } from '../constants/featureConstants';
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
    action: () => accountsService.getCurrentAccount().then((resp) => {
      const organizationID = resp?.data?.organization?.id;
      return organizationID ? Promise.all([
        authorizationsService.selfAccessReview({ action: 'create', resource_type: 'BareMetalCluster' }),
        accountsService.getFeature('assisted-installer', organizationID),
      ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled)
        : Promise.reject(Error('No organization'));
    }),
  },
];

export const detectFeatures = () => dispatch => features.forEach(({ name, action }) => action()
  .then(enabled => dispatch(setFeature(name, enabled)))
  .catch(() => dispatch(setFeature(name, false))));
