import { arrayToString } from '~/common/helpers';
import { Ingress, LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { NamespaceOwnershipPolicy } from '~/types/clusters_mgmt.v1/models/NamespaceOwnershipPolicy';
import { WildcardPolicy } from '~/types/clusters_mgmt.v1/models/WildcardPolicy';

export const routeSelectorPairsAsStrings = (routeSelectors = {}) =>
  Object.entries(routeSelectors).map((entry) => entry.join('=')) || [];

export const routeSelectorsAsString = (routeSelectors: RouteSelectors = {}) =>
  routeSelectorPairsAsStrings(routeSelectors).join(',') || '';

export const excludedNamespacesAsString = (namespaces?: string[]) =>
  arrayToString(namespaces) || '';

export type RouteSelectors = Ingress['route_selectors'];

export type ClusterRouter = {
  routerID?: string;
  isDefault: boolean;
  isPrivate: boolean;
  address?: string;
  loadBalancer?: LoadBalancerFlavor;
  routeSelectors?: RouteSelectors;
  excludedNamespaces?: string[];
  isNamespaceOwnershipPolicyStrict: boolean;
  isWildcardPolicyAllowed: boolean;
  tlsSecretRef?: string;
  hostname?: string;
};

export type ClusterRouters = {
  default?: ClusterRouter;
  additional?: ClusterRouter;
};

const NetworkingSelector = (clusterRouters: Ingress[]): ClusterRouters => {
  const routers: ClusterRouters = {};
  clusterRouters?.forEach((r: Ingress) => {
    const router: ClusterRouter = {
      routerID: r.id,
      isDefault: !!r.default,
      isPrivate: r.listening === 'internal',
      address: r.dns_name,
      loadBalancer: r.load_balancer_type,
      routeSelectors: r.route_selectors,
      excludedNamespaces: r.excluded_namespaces,
      // Default is NamespaceOwnershipPolicy.STRICT if route_namespace_ownership_policy not set
      isNamespaceOwnershipPolicyStrict:
        r.route_namespace_ownership_policy !== NamespaceOwnershipPolicy.INTER_NAMESPACE_ALLOWED,
      isWildcardPolicyAllowed: r.route_wildcard_policy === WildcardPolicy.WILDCARDS_ALLOWED,
      tlsSecretRef: r.cluster_routes_tls_secret_ref,
      hostname: r.cluster_routes_hostname,
    };

    if (router.isDefault) {
      routers.default = router;
    } else {
      routers.additional = router;
    }
  });
  return routers;
};

export default NetworkingSelector;
