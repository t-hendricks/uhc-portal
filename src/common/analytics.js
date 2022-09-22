import { tools } from './installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';

/**
 * a dictionary for mapping product keys to subscription plan ID values.
 * derived from the normalizedProducts map, with its values lower-cased.
 *
 * see subscriptionTypes.normalizedProducts for the available keys.
 *
 * @type {{[p: string]: string}}
 * @see subscriptionTypes.normalizedProducts
 */
const ocmResourceTypeByProduct = Object.fromEntries(
  Object.entries(normalizedProducts)
    .map(([key, value]) => (
      [key, String(value).toLowerCase()]
    )),
);

const ocmResourceType = {
  ...ocmResourceTypeByProduct,
  // OpenShift Local aka CodeReady Containers
  CRC: 'crc',
  // OpenShift on AWS aka ROSA
  MOA: 'moa',
  ROSA: 'moa',
  // All subscription plans
  ALL: 'all',
};

const eventNames = {
  FILE_DOWNLOADED: 'File Downloaded',
  BUTTON_CLICKED: 'Button Clicked',
  LINK_CLICKED: 'Link Clicked',
  ARNS_REFRESHED: 'ARNs Refreshed',
  CHECKBOX_CLICKED: 'Checkbox Clicked',
};

/**
 * OCM track events, see https://docs.google.com/spreadsheets/d/1C_WJWPy3sgE2ICaYHgWpWngj0A3Z3zl5GcstWySG9WE
 */
const trackEvents = {
  [tools.OC]: {
    deprecated_name: 'OCP-Download-CLITools',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.BUTANE]: {
    deprecated_name: 'Download-BUTANE-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'butane-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.CCOCTL]: {
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ccoctl-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.COREOS_INSTALLER]: {
    deprecated_name: 'Download-CoreOSInstaller-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'coreosinstaller-cli',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.CRC]: {
    deprecated_name: 'OCP-Download-CRC',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'crc',
    ocm_resource_type: ocmResourceType.CRC,
  },
  [tools.HELM]: {
    deprecated_name: 'Download-HELM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'helm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.X86INSTALLER]: {
    deprecated_name: 'OCP-Download-X86Installer',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-x86',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.IBMZINSTALLER]: {
    deprecated_name: 'OCP-Download-IBMZInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-ibmz',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.PPCINSTALLER]: {
    deprecated_name: 'OCP-Download-PPCInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-ppc',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.ARMINSTALLER]: {
    deprecated_name: 'OCP-Download-ARMInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-arm',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.MULTIINSTALLER]: {
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-multi',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.KN]: {
    deprecated_name: 'Download-KN-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'kn-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OCM]: {
    deprecated_name: 'Download-OCM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.ODO]: {
    deprecated_name: 'Download-ODO-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'odo-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OPERATOR_SDK]: {
    deprecated_name: 'Download-OSDK-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'osdk-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OPM]: {
    deprecated_name: 'Download-OPM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'opm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.RHOAS]: {
    deprecated_name: 'Download-RHOAS-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'rhoas-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.ROSA]: {
    deprecated_name: 'Download-ROSA-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'rosa-cli',
    ocm_resource_type: ocmResourceType.MOA,
  },
  [tools.MIRROR_REGISTRY]: {
    deprecated_name: 'Download-Mirror-Registry',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'mirror-registry',
    ocm_resource_type: ocmResourceType.OCP,
  },
  OCPInstallDocumentation: {
    deprecated_name: 'OCP-Download-OfficialDocumentation',
    event: eventNames.LINK_CLICKED,
    link_name: 'ocp-install-documentation',
    ocm_resource_type: ocmResourceType.OCP,
  },
  CRCInstallDocumentation: {
    deprecated_name: 'OCP-Download-OfficialDocumentation',
    event: eventNames.LINK_CLICKED,
    link_name: 'crc-documentation',
    ocm_resource_type: ocmResourceType.CRC,
  },
  CopyPullSecret: {
    deprecated_name: 'OCP-Copy-PullSecret',
    event: eventNames.BUTTON_CLICKED,
    link_name: 'pull-secret',
    ocm_resource_type: ocmResourceType.ALL,
  },
  DownloadPullSecret: {
    deprecated_name: 'OCP-Copy-PullSecret',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'pull-secret',
    ocm_resource_type: ocmResourceType.ALL,
  },
  RefreshARNs: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'refresh-arns',
    ocm_resource_type: ocmResourceType.MOA,
  },
  ARNsRefreshed: {
    event: eventNames.ARNS_REFRESHED,
    link_name: 'arns-refreshed',
    ocm_resource_type: ocmResourceType.MOA,
  },
  AssociateAWS: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'associate-aws',
    ocm_resource_type: ocmResourceType.MOA,
  },
  ROSALogin: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-rosa-login',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOCMRoleCreateBasic: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-create-basic',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOCMRoleCreateAdmin: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-create-admin',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOCMRoleLink: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-link',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleCreate: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-create',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleLink: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-link',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleList: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-list',
    ocm_resource_type: ocmResourceType.MOA,
  },
  InstallIntoVPC: {
    event: eventNames.CHECKBOX_CLICKED,
    link_name: 'install-into-existing-vpc',
  },
  ConfigureClusterWideProxy: {
    event: eventNames.CHECKBOX_CLICKED,
    link_name: 'configure-cluster-wide-proxy',
  },
  WizardNext: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-next',
  },
  WizardBack: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-back',
  },
  WizardSubmit: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-submit',
  },
  WizardLeave: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-leave',
  },
  WizardLinkNav: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-nav',
  },
};

/**
 * Returns the full trackEvent object that can be passed to analytics.track
 *
 * @param {Object} trackEvent - The common trackEvent metadata (mandatory)
 * @param {Object} options - configuration options:
 * - {String} url - Link URL
 * - {String} path - The current path of where the action was performed
 * - {String} resourceType - The resource type, for allowed values see ocmResourceType
 * - {Object} customProperties - A JSON-serializable object for any custom event data
 *
 * @returns {Object} Object {[event]: string, [properties]: Object}
 */
const getTrackEvent = (trackEvent, options = {}) => (
  {
    event: trackEvent.event,
    properties: {
      link_name: trackEvent.link_name,
      ...(options.url && { link_url: options.url }),
      current_path: options.path || window.location.pathname,
      ocm_resource_type:
        options.resourceType ?? trackEvent?.ocm_resource_type ?? ocmResourceType.ALL,
      ...options.customProperties,
    },
  }
);

export {
  eventNames,
  trackEvents,
  getTrackEvent,
  ocmResourceType,
  ocmResourceTypeByProduct,
};
