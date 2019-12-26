const MIRROR_CLIENTS_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_43_PRE = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp-dev-preview/latest-4.3/';
const DOCS_BASE = 'https://docs.openshift.com/container-platform/4.2';
const OSD_DOCS_BASE = 'https://docs.openshift.com/dedicated/4';

const links = {

  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,
  UNDERSTANDING_IDENTITY_PROVIDER: `${DOCS_BASE}/authentication/understanding-identity-provider.html`,
  DEDICATED_ADMIN_ROLE: `${OSD_DOCS_BASE}/administering_a_cluster/dedicated-admin-role.html`,

  DOWNLOAD_RHCOS_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.2/latest/',

  INSTALL_AWSIPI_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AWSIPI_CLI_LATEST: MIRROR_CLIENTS_LATEST,
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
  INSTALL_AWSUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_aws_user_infra/installing-aws-user-infra.html`,

  INSTALL_AZURE_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AZURE_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AZURE_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure/installing-azure-account.html`,

  INSTALL_BAREMETAL_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_BAREMETAL_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_BAREMETAL_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html`,
  INSTALL_BAREMETAL_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal`,

  INSTALL_CRC_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers/1.0/',
  INSTALL_CRC_DOWNLOAD_WINDOWS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-windows-amd64.zip',
  INSTALL_CRC_DOWNLOAD_MACOS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-macos-amd64.tar.xz',
  INSTALL_CRC_DOWNLOAD_LINUX: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz',

  INSTALL_GCP_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_GCP_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_GCP_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-account.html`,

  INSTALL_OSP_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_OSP_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_OSP_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,

  INSTALL_VSPHERE_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_VSPHERE_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_VSPHERE_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html`,
  INSTALL_VSPHERE_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html#installation-vsphere-machines_installing-vsphere`,

  INSTALL_IBMZ_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST_IBMZ,
  INSTALL_IBMZ_CLI_LATEST: MIRROR_CLIENTS_LATEST_IBMZ,
  INSTALL_IBMZ_GETTING_STARTED: 'https://docs.openshift.com/container-platform/4.2/installing/installing_ibm_z/installing-ibm-z.html',
  INSTALL_IBMZ_RHCOS_LEARN_MORE: 'https://docs.openshift.com/container-platform/4.2/installing/installing_ibm_z/installing-ibm-z.html#installation-user-infra-machines-iso_installing-ibm-z',
  DOWNLOAD_RHCOS_LATEST_IBMZ: 'https://mirror.openshift.com/pub/openshift-v4/s390x/dependencies/rhcos/4.2/latest/',

  INSTALL_PRE_RELEASE_BUG_LIST_43: 'https://bugzilla.redhat.com/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&bug_status=POST&bug_status=MODIFIED&columnlist=bug_status%2Ccomponent%2Cshort_desc%2Cassigned_to_realname%2Creporter_realname%2Cchangeddate&keywords=TestBlocker&keywords_type=allwords&known_name=OCP4-3-blocker&list_id=10675364&product=OpenShift%20Container%20Platform&query_based_on=OCP4-3-blocker&query_format=advanced&target_release=4.3.0',
  INSTALL_PRE_RELEASE_INSTALLER_DOC: 'https://github.com/openshift/installer/tree/master/docs/user',
  INSTALL_PRE_RELEASE_INSTALLER_LATEST_43: MIRROR_CLIENTS_LATEST_43_PRE,
  INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_43: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest',
  INSTALL_PRE_RELEASE_CLI_LATEST_43: MIRROR_CLIENTS_LATEST_43_PRE,
  INSTALL_PRE_RELEASE_FEEDBACK_MAILTO: 'mailto:***REMOVED***?subject=[dev preview build]',
  INSTALL_PRE_RELEASE_SUPPORT_KCS: 'https://access.redhat.com/articles/4307871',
};

export default links;
