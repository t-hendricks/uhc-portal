import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';

export const LoadBalancerFlavorLabel = {
  [LoadBalancerFlavor.CLASSIC]: 'Classic Ingress',
  [LoadBalancerFlavor.NLB]: 'External network load balancer',
};
