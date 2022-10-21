import React from 'react';
import { useGlobalState } from '~/redux/hooks/useGlobalState';

/**
 * Accumulate and return a record features from the "features" querystring
 * @returns Record of features where the key is the feature name and the value is true or false
 */
export const useFeatures = () => {
  const featureQuery = useGlobalState((state) => state.router.location.query.features);

  const features = React.useMemo(() => {
    if (featureQuery) {
      const parsedFeatures: Record<string, string> = JSON.parse(decodeURI(featureQuery)) || {};

      if (Object.keys(parsedFeatures).length > 0) {
        return Object.entries(parsedFeatures).reduce(
          (acc: Record<string, boolean>, [name, value]) => {
            // eslint-disable-next-line no-param-reassign
            acc[name] = value === 'true';

            return acc;
          },
          {},
        );
      }
    }

    return {};
  }, [featureQuery]);

  return features;
};
