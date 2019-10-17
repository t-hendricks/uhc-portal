const MIRROR_CLIENTS_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/';
const DOCS_BASE = 'https://docs.openshift.com/container-platform/4.2';

const links = {

  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,

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

  INSTALL_CRC_GETTING_STARTED: 'https://code-ready.github.io/crc/',
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
};

export default links;
