const MIRROR_CLIENTS_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/clients/ocp/latest/';
const MIRROR_CLIENTS_LATEST_PRE = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp-dev-preview/pre-release/';
const MIRROR_RHCOS_LATEST_X86 = 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/latest/latest';
const MIROR_RHCOS_LATEST_S390X = 'https://mirror.openshift.com/pub/openshift-v4/s390x/dependencies/rhcos/latest/latest';
const MIRROR_RHCOS_LATEST_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/dependencies/rhcos/latest/latest';
const DOCS_BASE = 'https://docs.openshift.com/container-platform/latest';
const IBMZ_DOCS_BASE = 'https://docs.openshift.com/container-platform/4.3';
const PPC_DOCS_BASE = 'https://docs.openshift.com/container-platform/4.4';
const OSD_DOCS_BASE = 'https://docs.openshift.com/dedicated/4';

const links = {

  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  SUBSCRIPTION_EVAL_INFORMATION: 'https://access.redhat.com/articles/4389911',
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,
  UNDERSTANDING_IDENTITY_PROVIDER: `${DOCS_BASE}/authentication/understanding-identity-provider.html`,
  DEDICATED_ADMIN_ROLE: `${OSD_DOCS_BASE}/administering_a_cluster/dedicated-admin-role.html`,

  INSTALLER_LINUX: `${MIRROR_CLIENTS_LATEST}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_PPC: `${MIRROR_CLIENTS_LATEST_PPC}openshift-install-linux.tar.gz`,

  INSTALLER_MAC: `${MIRROR_CLIENTS_LATEST}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_PPC: `${MIRROR_CLIENTS_LATEST_PPC}openshift-install-mac.tar.gz`,

  CLI_TOOLS_LINUX: `${MIRROR_CLIENTS_LATEST}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_PPC: `${MIRROR_CLIENTS_LATEST_PPC}openshift-client-linux.tar.gz`,

  CLI_TOOLS_MAC: `${MIRROR_CLIENTS_LATEST}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_PPC: `${MIRROR_CLIENTS_LATEST_PPC}openshift-client-mac.tar.gz`,

  CLI_TOOLS_WINDOWS: `${MIRROR_CLIENTS_LATEST}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_IBMZ: `${MIRROR_CLIENTS_LATEST_IBMZ}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_PPC: `${MIRROR_CLIENTS_LATEST_PPC}openshift-client-windows.zip`,

  INSTALL_AWSIPI_DOCS_LANDING: `${DOCS_BASE}/installing/installing_aws/installing-aws-account.html`,
  INSTALL_AWSIPI_DOCS_ENTRY: `${DOCS_BASE}/welcome/index.html`,

  INSTALL_AWSUPI_INSTALLER_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AWSUPI_CLI_LATEST: MIRROR_CLIENTS_LATEST,
  INSTALL_AWSUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_aws/installing-aws-user-infra.html`,

  INSTALL_AWS_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_aws/installing-aws-customizations.html`,

  INSTALL_AZUREUPI_GETTING_STARTED: 'https://github.com/openshift/installer/blob/master/docs/user/azure/install_upi.md',
  INSTALL_AZUREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure/installing-azure-default.html`,
  INSTALL_AZURE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_azure/installing-azure-customizations.html`,

  INSTALL_BAREMETAL_UPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html`,
  INSTALL_BAREMETAL_IPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal_ipi/ipi-install-installation-workflow.html`,
  INSTALL_BAREMETAL_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal`,
  INSTALL_BAREMETAL_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal-network-customizations.html`,
  RHCOS_BAREMETAL_ISO_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-installer.x86_64.iso`,
  RHCOS_BAREMETAL_ISO_S390X: `${MIROR_RHCOS_LATEST_S390X}/rhcos-installer.s390x.iso`,
  RHCOS_BAREMETAL_ISO_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-installer.ppc64le.iso`,
  RHCOS_BAREMETAL_RAW_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-metal.x86_64.raw.gz`,
  RHCOS_BAREMETAL_RAW_S390X: `${MIROR_RHCOS_LATEST_S390X}/rhcos-metal.s390x.raw.gz`,
  RHCOS_BAREMETAL_RAW_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-metal.ppc64le.raw.gz`,

  INSTALL_CRC_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers',
  INSTALL_CRC_DOWNLOAD_WINDOWS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-windows-amd64.zip',
  INSTALL_CRC_DOWNLOAD_MACOS: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-macos-amd64.tar.xz',
  INSTALL_CRC_DOWNLOAD_LINUX: 'https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz',

  INSTALL_GCPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-account.html`,
  INSTALL_GCPUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html`,
  INSTALL_GCPUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html#installation-gcp-user-infra-rhcos_installing-gcp-user-infra`,
  INSTALL_GCP_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-customizations.html`,
  RHCOS_GCPUPI_TAR_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-4.5.6-x86_64-gcp.x86_64.tar.gz`,

  INSTALL_OSPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,
  INSTALL_OSPUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-user.html`,
  INSTALL_OSPUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-user.html#installation-osp-creating-image_installing-openstack-user`,
  INSTALL_OSP_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,
  RHCOS_OSPUPI_QCOW_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-openstack.x86_64.qcow2.gz`,
  RHCOS_OSPUPI_QCOW_S390X: `${MIROR_RHCOS_LATEST_S390X}/rhcos-openstack.s390x.qcow2.gz`,
  RHCOS_OSPUPI_QCOW_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-openstack.ppc64le.qcow2.gz`,

  INSTALL_VSPHERE_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html`,
  INSTALL_VSPHERE_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html#installation-vsphere-machines_installing-vsphere`,
  INSTALL_VSPHERE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere-installer-provisioned-customizations.html`,
  RHCOS_VSPHERE_OVA_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-vmware.x86_64.ova`,

  INSTALL_IBMZ_GETTING_STARTED: `${IBMZ_DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html`,
  INSTALL_IBMZ_RHCOS_LEARN_MORE: `${IBMZ_DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html#installation-user-infra-machines-iso-ibm-z_installing-ibm-z`,
  RHCOS_IBMZ_INITRAMFS: `${MIROR_RHCOS_LATEST_S390X}/rhcos-installer-initramfs.s390x.img`,
  RHCOS_IBMZ_KERNEL: `${MIROR_RHCOS_LATEST_S390X}/rhcos-installer-kernel-s390x`,
  RHCOS_IBMZ_DASD: `${MIROR_RHCOS_LATEST_S390X}/rhcos-dasd.s390x.raw.gz`,
  RHCOS_IBMZ_FCP: `${MIROR_RHCOS_LATEST_S390X}/rhcos-metal.s390x.raw.gz`,

  INSTALL_RHVIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-default.html`,
  INSTALL_RHV_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-customizations.html`,
  INSTALL_RHVUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-user-infra.html`,

  INSTALL_PRE_RELEASE_BUG_LIST_45: 'https://bugzilla.redhat.com/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&bug_status=POST&bug_status=MODIFIED&columnlist=bug_status%2Ccomponent%2Cshort_desc%2Cassigned_to_realname%2Creporter_realname%2Cchangeddate&keywords=TestBlocker&keywords_type=allwords&known_name=OCP4-3-blocker&list_id=10675364&product=OpenShift%20Container%20Platform&query_based_on=OCP4-4-blocker&query_format=advanced&target_release=4.5.0',
  INSTALL_PRE_RELEASE_INSTALLER_DOC: 'https://github.com/openshift/installer/tree/master/docs/user',
  INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest',
  INSTALL_PRE_RELEASE_FEEDBACK_MAILTO: 'mailto:***REMOVED***?subject=[dev preview build]',
  INSTALL_PRE_RELEASE_SUPPORT_KCS: 'https://access.redhat.com/articles/4307871',

  INSTALL_POWER_GETTING_STARTED: `${PPC_DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html`,
  INSTALL_POWER_RHCOS_LEARN_MORE: `${PPC_DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html#creating-machines-bare-metal-power`,
  RHCOS_POWER_ISO_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-installer.ppc64le.iso`,
  RHCOS_POWER_RAW_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-metal.ppc64le.raw.gz`,
};

const channels = {
  PRE_RELEASE: 'preRelease',
  IBMZ: 'ibmz',
  STABLE: 'stable',
  PPC: 'ppc64le',
  CRC: 'CRC',
};

const urls = {
  [channels.STABLE]: {
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
  [channels.PRE_RELEASE]: {
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
  [channels.IBMZ]: {
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

  [channels.PPC]: {
    windows: {
      cli: links.CLI_TOOLS_WINDOWS_PPC,
    },
    linux: {
      installer: links.INSTALLER_LINUX_PPC,
      cli: links.CLI_TOOLS_LINUX_PPC,
    },
    mac: {
      installer: links.INSTALLER_MAC_PPC,
      cli: links.CLI_TOOLS_MAC_PPC,
    },
  },

  [channels.CRC]: {
    windows: {
      installer: links.INSTALL_CRC_DOWNLOAD_WINDOWS,
    },
    mac: {
      installer: links.INSTALL_CRC_DOWNLOAD_MACOS,
    },
    linux: {
      installer: links.INSTALL_CRC_DOWNLOAD_LINUX,
    },
  },
};

export {
  channels,
  urls,
};
export default links;
