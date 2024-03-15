import { useGlobalState } from '~/redux/hooks';
import { Product } from '~/types/clusters_mgmt.v1';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { hasOrgLevelAutoscaleCapability } from '../../../MachinePoolsSelectors';

const useCanClusterAutoscale = (product: Product['id']) => {
  const orgLevelAutoscale = useGlobalState(hasOrgLevelAutoscaleCapability);

  return (
    product === normalizedProducts.ROSA || (product === normalizedProducts.OSD && orgLevelAutoscale)
  );
};

export default useCanClusterAutoscale;
