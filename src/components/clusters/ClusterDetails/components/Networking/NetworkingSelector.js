import get from 'lodash/get';

export const routeSelectorPairsAsStrings = (routeSelectors = {}) =>
  Object.entries(routeSelectors).map((entry) => entry.join('=')) || [];

export const routeSelectorsAsString = (routeSelectors) =>
  routeSelectorPairsAsStrings(routeSelectors).join(',') || null;

const NetworkingSelector = (state) => {
  const { clusterRouters } = state;
  const routers = {};
  get(clusterRouters, 'getRouters.routers', []).forEach((r) => {
    const router = {
      routerID: r.id,
      isDefault: r.default,
      isPrivate: r.listening === 'internal',
      address: r.dns_name,
    };
    const routeSelectors = !router.isDefault ? r.route_selectors : null;
    if (routeSelectors) {
      router.routeSelectors = routeSelectors;
    }
    if (router.isDefault) {
      routers.default = router;
    } else {
      routers.additional = router;
    }
  });
  return routers;
};

export default NetworkingSelector;
