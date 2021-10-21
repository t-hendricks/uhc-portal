// TODO OCM RBAC phase 2: may require a selector for the cluster viewer role.
// const accessModel = get(state, 'userProfile.organization.details.access_model');
const canGrantClusterViewerSelector = () => false;

export default canGrantClusterViewerSelector;
