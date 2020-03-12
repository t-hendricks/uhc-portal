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
    const routerID = r.id;
    const isDefault = r.default;
    const isPrivate = r.listening === 'internal';
    const routeSelectors = !isDefault ? r.route_selectors : null;
    const router = { routerID, isDefault, isPrivate };
    if (routeSelectors) {
      router.routeSelectors = routeSelectorsToString(routeSelectors);
    }
    if (isDefault) {
      routers.default = router;
    } else {
      routers.additional = router;
    }
  });
  return routers;
};

export default NetworkingSelector;
