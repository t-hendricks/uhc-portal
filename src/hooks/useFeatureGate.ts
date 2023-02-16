import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { GlobalState } from '~/redux/store';

const useFeatureGate = (feature: string) => {
  const features = useGlobalState((state) => state.features);

  return (features && features[feature]) || false;
};

const featureGateSelector = (state: GlobalState, feature: string) =>
  (state.features && state.features[feature]) || false;

export { useFeatureGate as default, useFeatureGate, featureGateSelector };
