import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { GlobalState } from '~/redux/store';

const isFeatureEnabled = (features: any, feature: string) =>
  (features && features[feature]) || false;

const useFeatureGate = (feature: string) => {
  const features = useGlobalState((state) => state.features);
  return isFeatureEnabled(features, feature);
};

const featureGateSelector = (state: GlobalState, feature: string) =>
  isFeatureEnabled(state.features, feature);

export { useFeatureGate as default, useFeatureGate, featureGateSelector };
