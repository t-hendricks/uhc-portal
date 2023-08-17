/**
 * Modal names, to be passed to openModal and shouldShowModal.
 * @enum {String}
 */
const modals = {
  ARCHIVE_CLUSTER: 'archive-cluster',
  UNARCHIVE_CLUSTER: 'unarchive-cluster',
  SCALE_CLUSTER: 'edit-cluster',
  EDIT_NODE_COUNT: 'edit-node-count',
  EDIT_DISPLAY_NAME: 'edit-display-name',
  EDIT_CONSOLE_URL: 'edit-console-url',
  EDIT_CLUSTER_INGRESS: 'edit-cluster-ingress',
  EDIT_APPLICATION_INGRESS: 'edit-application-ingress',
  DELETE_CLUSTER: 'delete-cluster',
  UPGRADE_WIZARD: 'upgrade-wizard',
  TRANSFER_CLUSTER_OWNERSHIP: 'transfer-cluster-ownership',
  UPGRADE_TRIAL_CLUSTER: 'upgrade-trial-cluster',
  EDIT_SUBSCRIPTION_SETTINGS: 'edit-subscription-settings',
  HIBERNATE_CLUSTER: 'hibernate-cluster',
  RESUME_CLUSTER: 'resume-cluster',
  EDIT_TAINTS: 'edit-taints',
  EDIT_LABELS: 'edit-labels',
  DELETE_MACHINE_POOL: 'delete-machine-pool',
  OCM_ROLES: 'ocm-roles',
  UPDATE_MACHINE_POOL_VERSION: 'update-machine-pool-version',
};
export default modals;
