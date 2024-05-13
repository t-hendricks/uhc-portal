/**
 * Modal names, to be passed to openModal and shouldShowModal.
 * @enum {String}
 */
const modals = {
  ARCHIVE_CLUSTER: 'archive-cluster',
  UNARCHIVE_CLUSTER: 'unarchive-cluster',
  SCALE_CLUSTER: 'edit-cluster',
  EDIT_CLUSTER_WIDE_PROXY: 'EDIT_CLUSTER_WIDE_PROXY',
  EDIT_DISPLAY_NAME: 'edit-display-name',
  EDIT_CONSOLE_URL: 'edit-console-url',
  EDIT_CLUSTER_INGRESS: 'edit-cluster-ingress',
  EDIT_MACHINE_POOL: 'edit-machine-pool',
  EDIT_APPLICATION_INGRESS: 'edit-application-ingress',
  EDIT_CLUSTER_AUTOSCALING_V1: 'edit-cluster-autoscaling-v1', // redux-form
  EDIT_CLUSTER_AUTOSCALING_V2: 'edit-cluster-autoscaling-v2', // formik
  DELETE_CLUSTER: 'delete-cluster',
  UPGRADE_WIZARD: 'upgrade-wizard',
  TRANSFER_CLUSTER_OWNERSHIP: 'transfer-cluster-ownership',
  UPGRADE_TRIAL_CLUSTER: 'upgrade-trial-cluster',
  EDIT_SUBSCRIPTION_SETTINGS: 'edit-subscription-settings',
  HIBERNATE_CLUSTER: 'hibernate-cluster',
  RESUME_CLUSTER: 'resume-cluster',
  DELETE_MACHINE_POOL: 'delete-machine-pool',
  OCM_ROLES: 'ocm-roles',
  UPDATE_MACHINE_POOL_VERSION: 'update-machine-pool-version',
  ADD_NOTIFICATION_CONTACT: 'add-notification-contact',
  REGISTER_CLUSTER_ERROR: 'register-cluster-error',
  DELETE_PROTECTION: 'delete-protection',
};
export default modals;
