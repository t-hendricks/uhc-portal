import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { useGlobalState } from '~/redux/hooks';
import { Product } from '~/types/clusters_mgmt.v1';

import { hasOrgLevelAutoscaleCapability } from '../../../machinePoolsSelectors';

const useCanClusterAutoscale = (
  product: Product['id'],
  billingModel: string | undefined /* TO-DO: should use type from openAPI once it's updated */,
) => {
  const hasAutoScaleCapability = useGlobalState((state) =>
    hasOrgLevelAutoscaleCapability(state.userProfile.organization.details),
  );
  return (
    product === normalizedProducts.ROSA ||
    (product === normalizedProducts.OSD &&
      (billingModel === billingModels.MARKETPLACE ||
        billingModel === billingModels.MARKETPLACE_AWS ||
        billingModel === billingModels.MARKETPLACE_GCP)) ||
    (product === normalizedProducts.OSD && hasAutoScaleCapability)
  );
};

export default useCanClusterAutoscale;
