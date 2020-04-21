const routeSelectorsToString = (routeSelectors) => {
  const selectorStrings = [];
  Object.keys(routeSelectors).forEach((key) => {
    selectorStrings.push(`${key}=${routeSelectors[key]}`);
  });
  return selectorStrings.join(', ');
};

const NetworkingSelector = (state) => {
  const { clusterRouters } = state;
  const routers = {};
  clusterRouters.getRouters.routers.forEach((r) => {
    const router = {
      routerID: r.id,
      isDefault: r.default,
      isPrivate: r.listening === 'internal',
      address: r.dns_name,
    };
    const routeSelectors = !router.isDefault ? r.route_selectors : null;
    if (routeSelectors) {
      router.routeSelectors = routeSelectorsToString(routeSelectors);
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
