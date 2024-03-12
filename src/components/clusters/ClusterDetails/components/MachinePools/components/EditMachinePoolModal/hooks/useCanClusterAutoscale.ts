import { useGlobalState } from '~/redux/hooks';
import { Product } from '~/types/clusters_mgmt.v1';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { hasOrgLevelAutoscaleCapability } from '../../../machinePoolsSelectors';

const useCanClusterAutoscale = (product: Product['id']) => {
  const organization = useGlobalState((state) =>
    hasOrgLevelAutoscaleCapability(state.userProfile.organization.details),
  );

  return (
    product === normalizedProducts.ROSA || (product === normalizedProducts.OSD && organization)
  );
};

export default useCanClusterAutoscale;
