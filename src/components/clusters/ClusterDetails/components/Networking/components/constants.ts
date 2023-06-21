import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';

export const LoadBalancerFlavorLabel = {
  [LoadBalancerFlavor.CLASSIC]: 'Classic',
  [LoadBalancerFlavor.NLB]: 'Network Load Balancer',
};
