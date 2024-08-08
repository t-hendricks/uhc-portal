import { RESTRICTED_ENV_OVERRIDE_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { GlobalState } from '~/redux/store';

const isFeatureEnabled = (features: any, feature: string) =>
  (features && features[feature]) || false;

const useFeatureGate = (feature: string) => {
  const features = useGlobalState((state) => state.features);
  const simulatedRestrictedEnv = !!localStorage.getItem(RESTRICTED_ENV_OVERRIDE_LOCALSTORAGE_KEY);
  if (simulatedRestrictedEnv) {
    // TODO: Right now no features are enabled for restricted envs. If that changes we should partially allow those.
    return false;
  }
  return isFeatureEnabled(features, feature);
};

const featureGateSelector = (state: GlobalState, feature: string) =>
  isFeatureEnabled(state.features, feature);

export { useFeatureGate, featureGateSelector };
export default useFeatureGate;
