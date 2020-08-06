import { SET_FEATURE, ASSISTED_INSTALLER_FEATURE } from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';

const setFeature = (feature, enabled) => ({
  type: SET_FEATURE,
  payload: { feature, enabled },
});

// list of features to detect upon app startup
export const features = [
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: () => authorizationsService.selfAccessReview({ action: 'create', resource_type: 'BareMetalCluster' })
      .then(resp => resp.data.allowed),
  },
];

export const detectFeatures = () => dispatch => features.forEach(({ name, action }) => action()
  .then(enabled => dispatch(setFeature(name, enabled)))
  .catch(() => dispatch(setFeature(name, false))));
