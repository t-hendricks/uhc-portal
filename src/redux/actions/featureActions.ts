import { action, ActionType } from 'typesafe-actions';
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
  OSD_WIZARD_V2_FEATURE,
  ROSA_CREATION_WIZARD_FEATURE,
  HYPERSHIFT_WIZARD_FEATURE,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';
import { SelfAccessReview } from '../../types/authorizations.v1/models/SelfAccessReview';
import type { AppThunk } from '../types';

const setFeatureAction = (feature: string, enabled: boolean) =>
  action(SET_FEATURE, { feature, enabled });

const getSimpleUnleashFeature = (unleashFeatureName: string, name: string) => ({
  name,
  action: () =>
    authorizationsService
      .selfFeatureReview(unleashFeatureName)
      .then((unleash) => unleash.data.enabled),
});

// list of features to detect upon app startup
export const features = [
  getSimpleUnleashFeature('osd-trial', OSD_TRIAL_FEATURE),
  getSimpleUnleashFeature('hypershift-creation-wizard', HYPERSHIFT_WIZARD_FEATURE),
  getSimpleUnleashFeature('assisted-installer-sno', ASSISTED_INSTALLER_SNO_FEATURE),
  getSimpleUnleashFeature('assisted-installer-ocs', ASSISTED_INSTALLER_OCS_FEATURE),
  getSimpleUnleashFeature('assisted-installer-cnv', ASSISTED_INSTALLER_CNV_FEATURE),
  getSimpleUnleashFeature('assisted-installer-merge-lists', ASSISTED_INSTALLER_MERGE_LISTS_FEATURE),
  getSimpleUnleashFeature(
    'assisted-installer-network-type-selection',
    ASSISTED_INSTALLER_NETWORK_TYPE_SELECTION_FEATURE,
  ),
  getSimpleUnleashFeature(
    'assisted-installer-platform-integration',
    ASSISTED_INSTALLER_PLATFORM_INTEGRATION_FEATURE,
  ),
  getSimpleUnleashFeature('osd-creation-wizard-v2', OSD_WIZARD_V2_FEATURE),
  getSimpleUnleashFeature('rosa-creation-wizard', ROSA_CREATION_WIZARD_FEATURE),
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
];

export const detectFeatures = (): AppThunk => (dispatch) => {
  features.forEach(({ name, action: featureAction }) =>
    featureAction()
      .then((enabled) => dispatch(setFeatureAction(name, enabled)))
      .catch(() => dispatch(setFeatureAction(name, false))),
  );
};

export type FeatureAction = ActionType<typeof setFeatureAction>;
