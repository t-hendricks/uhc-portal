const MIRROR_CLIENTS_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_44_PRE = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp-dev-preview/latest-4.4/';
const DOCS_BASE = 'https://docs.openshift.com/container-platform/latest';
const DOCS_BASE_4_2 = ' https://docs.openshift.com/container-platform/4.2';
const OSD_DOCS_BASE = 'https://docs.openshift.com/dedicated/4';

const channels = {
  PRE_RELEASE: 'pre-release',
  IBMZ: 'ibm-z',
  STABLE: 'stable',
};

const links = {

  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  SUBSCRIPTION_EVAL_INFORMATION: 'https://access.redhat.com/articles/4389911',
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,
  UNDERSTANDING_IDENTITY_PROVIDER: `${DOCS_BASE}/authentication/understanding-identity-provider.html`,
  DEDICATED_ADMIN_ROLE: `${OSD_DOCS_BASE}/administering_a_cluster/dedicated-admin-role.html`,

  DOWNLOAD_RHCOS_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/latest/latest/',

  INSTALLER_LINUX: `${MIRROR_CLIENTS_LATEST}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_44_PRE}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-install-linux.tar.gz`,

  INSTALLER_MAC: `${MIRROR_CLIENTS_LATEST}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_44_PRE}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-install-mac.tar.gz`,

  CLI_TOOLS_LINUX: `${MIRROR_CLIENTS_LATEST}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_44_PRE}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-linux.tar.gz`,

  CLI_TOOLS_MAC: `${MIRROR_CLIENTS_LATEST}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_44_PRE}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-mac.tar.gz`,

  CLI_TOOLS_WINDOWS: `${MIRROR_CLIENTS_LATEST}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_44_PRE}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-windows.zip`,

  INSTALL_AWSIPI_DOCS_LANDING: `${DOCS_BASE}/installing/installing_aws/installing-aws-account.html`,
  INSTALL_AWSIPI_CONFIGURE_ACCOUNT: `${DOCS_BASE}/installing/installing_aws/installing-aws-account.html`,
  INSTALL_AWSIPI_INSTALLATION_CONFIG: `${DOCS_BASE}/installing/installing_aws/installing-aws-customizations.html#installation-configuration-parameters_installing-aws-customizations`,
  INSTALL_AWSIPI_SAMPLE_YAML: `${DOCS_BASE}/installing/installing_aws/installing-aws-customizations.html#installation-aws-config-yaml_installing-aws-customizations`,
  INSTALL_AWSIPI_CUSTOMIZING_NETWORK: `${DOCS_BASE}/installing/installing_aws/installing-aws-network-customizations.html`,
  INSTALL_AWSIPI_LIKELY_FAILURE_MODES: 'https://github.com/openshift/installer/blob/master/docs/user/troubleshooting.md#common-failures',
  INSTALL_AWSIPI_GENERIC_TROUBLESHOOTING: 'https://github.com/openshift/installer/blob/master/docs/user/troubleshooting.md#generic-troubleshooting',
  INSTALL_AWSIPI_DOCS_ENTRY: `${DOCS_BASE}/welcome/index.html`,

  INSTALL_AWSUPI_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AWSUPI_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AWSUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_aws/installing-aws-user-infra.html`,

  INSTALL_AZUREUPI_GETTING_STARTED: 'https://github.com/openshift/installer/blob/master/docs/user/azure/install_upi.md',
  INSTALL_AZUREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure/installing-azure-default.html`,

  INSTALL_BAREMETAL_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html`,
  INSTALL_BAREMETAL_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal`,

  INSTALL_CRC_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers',
  INSTALL_CRC_DOWNLOAD_WINDOWS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-windows-amd64.zip',
  INSTALL_CRC_DOWNLOAD_MACOS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-macos-amd64.tar.xz',
  INSTALL_CRC_DOWNLOAD_LINUX: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz',

  INSTALL_GCPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-account.html`,
  INSTALL_GCPUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html`,
  INSTALL_GCPUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html#installation-gcp-user-infra-rhcos_installing-gcp-user-infra`,

  INSTALL_OSPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,
  INSTALL_OSPUPI_GETTING_STARTED: 'https://github.com/openshift/installer/blob/master/docs/user/openstack/install_upi.md',
  INSTALL_OSPUPI_RHCOS_LEARN_MORE: 'https://github.com/openshift/installer/blob/master/docs/user/openstack/install_upi.md#red-hat-enterprise-linux-coreos-rhcos',
  INSTALL_OSPUPI_DOWNLOAD_RHCOS_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest/',

  INSTALL_VSPHERE_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html`,
  INSTALL_VSPHERE_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html#installation-vsphere-machines_installing-vsphere`,

  INSTALL_IBMZ_GETTING_STARTED: `${DOCS_BASE_4_2}/installing/installing_ibm_z/installing-ibm-z.html`,
  INSTALL_IBMZ_RHCOS_LEARN_MORE: `${DOCS_BASE_4_2}/installing/installing_ibm_z/installing-ibm-z.html#installation-user-infra-machines-iso-ibm-z_installing-ibm-z`,
  DOWNLOAD_RHCOS_LATEST_IBMZ: 'https://mirror.openshift.com/pub/openshift-v4/s390x/dependencies/rhcos/4.2/latest/',

  INSTALL_RHV_GETTING_STARTED: 'https://access.redhat.com/articles/4903411',

  INSTALL_PRE_RELEASE_BUG_LIST_44: 'https://bugzilla.redhat.com/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&bug_status=POST&bug_status=MODIFIED&columnlist=bug_status%2Ccomponent%2Cshort_desc%2Cassigned_to_realname%2Creporter_realname%2Cchangeddate&keywords=TestBlocker&keywords_type=allwords&known_name=OCP4-3-blocker&list_id=10675364&product=OpenShift%20Container%20Platform&query_based_on=OCP4-4-blocker&query_format=advanced&target_release=4.4.0',
  INSTALL_PRE_RELEASE_INSTALLER_DOC: 'https://github.com/openshift/installer/tree/master/docs/user',
  INSTALL_PRE_RELEASE_INSTALLER_LATEST_44: MIRROR_CLIENTS_LATEST_44_PRE,
  INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_44: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest',
  INSTALL_PRE_RELEASE_CLI_LATEST_44: MIRROR_CLIENTS_LATEST_44_PRE,
  INSTALL_PRE_RELEASE_FEEDBACK_MAILTO: 'mailto:***REMOVED***?subject=[dev preview build]',
  INSTALL_PRE_RELEASE_SUPPORT_KCS: 'https://access.redhat.com/articles/4307871',
};

const urls = {
  stable: {
    windows: {
      cli: links.CLI_TOOLS_WINDOWS,
    },
    linux: {
      installer: links.INSTALLER_LINUX,
      cli: links.CLI_TOOLS_LINUX,
    },
    mac: {
      installer: links.INSTALLER_MAC,
      cli: links.CLI_TOOLS_MAC,
    },
  },
  preRelease: {
    windows: {
      cli: links.CLI_TOOLS_WINDOWS_PRE_RELEASE,
    },
    linux: {
      installer: links.INSTALLER_LINUX_PRE_RELEASE,
      cli: links.CLI_TOOLS_LINUX_PRE_RELEASE,
    },
    mac: {
      installer: links.INSTALLER_MAC_PRE_RELEASE,
      cli: links.CLI_TOOLS_MAC_PRE_RELEASE,
    },
  },
  ibmz: {
    windows: {
      cli: links.CLI_TOOLS_WINDOWS_IBMZ,
    },
    linux: {
      installer: links.INSTALLER_LINUX_IBMZ,
      cli: links.CLI_TOOLS_LINUX_IBMZ,
    },
    mac: {
      installer: links.INSTALLER_MAC_IBMZ,
      cli: links.CLI_TOOLS_MAC_IBMZ,
    },
  },
};


export { channels, urls };
export default links;
