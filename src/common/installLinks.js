const MIRROR_CLIENTS_STABLE = 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/';
const MIRROR_CLIENTS_STABLE_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp/stable/';
const MIRROR_CLIENTS_STABLE_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/clients/ocp/stable/';
const MIRROR_CLIENTS_LATEST_PRE = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp-dev-preview/pre-release/';
const MIRROR_CLIENTS_ARM_PRE = 'https://mirror.openshift.com/pub/openshift-v4/aarch64/clients/ocp-dev-preview/pre-release';
const MIRROR_RHCOS_LATEST_X86 = 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/latest/latest';
const MIROR_RHCOS_LATEST_S390X = 'https://mirror.openshift.com/pub/openshift-v4/s390x/dependencies/rhcos/latest/latest';
const MIRROR_RHCOS_LATEST_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/dependencies/rhcos/latest/latest';
const MIRROR_ODO_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest';

const DOCS_BASE = 'https://docs.openshift.com/container-platform/latest';
const OSD_DOCS_BASE = 'https://docs.openshift.com/dedicated/4';

const OCM_DOCS_BASE = 'https://access.redhat.com/documentation/en-us/openshift_cluster_manager/2021';

const links = {
  AWS_ARM_GITHUB: 'https://github.com/openshift/ocp-on-arm',
  AWS_ARM_DOCS: 'https://github.com/openshift/ocp-on-arm/blob/main/README.md',

  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  SUBSCRIPTION_EVAL_INFORMATION: 'https://access.redhat.com/articles/4389911',
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,
  UNDERSTANDING_IDENTITY_PROVIDER: `${DOCS_BASE}/authentication/understanding-identity-provider.html`,
  DEDICATED_ADMIN_ROLE: `${OSD_DOCS_BASE}/administering_a_cluster/dedicated-admin-role.html`,

  INSTALLER_LINUX: `${MIRROR_CLIENTS_STABLE}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_IBMZ: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-linux.tar.gz`,
  INSTALLER_LINUX_PPC: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-linux.tar.gz`,

  INSTALLER_MAC: `${MIRROR_CLIENTS_STABLE}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_IBMZ: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-mac.tar.gz`,
  INSTALLER_MAC_PPC: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-mac.tar.gz`,

  CLI_TOOLS_LINUX: `${MIRROR_CLIENTS_STABLE}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_IBMZ: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-client-linux.tar.gz`,
  CLI_TOOLS_LINUX_PPC: `${MIRROR_CLIENTS_STABLE_PPC}openshift-client-linux.tar.gz`,

  CLI_TOOLS_MAC: `${MIRROR_CLIENTS_STABLE}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_IBMZ: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-client-mac.tar.gz`,
  CLI_TOOLS_MAC_PPC: `${MIRROR_CLIENTS_STABLE_PPC}openshift-client-mac.tar.gz`,

  CLI_TOOLS_WINDOWS: `${MIRROR_CLIENTS_STABLE}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_PRE_RELEASE: `${MIRROR_CLIENTS_LATEST_PRE}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_IBMZ: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-client-windows.zip`,
  CLI_TOOLS_WINDOWS_PPC: `${MIRROR_CLIENTS_STABLE_PPC}openshift-client-windows.zip`,

  CLI_TOOLS_OCP_GETTING_STARTED: `${DOCS_BASE}/cli_reference/openshift_cli/getting-started-cli.html`,
  CLI_TOOLS_OSD_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/openshift_dedicated/4/html/cli_tools/index',

  INSTALL_DOCS_ENTRY: `${DOCS_BASE}/installing/index.html`,

  INSTALL_AWSIPI_DOCS_LANDING: `${DOCS_BASE}/installing/installing_aws/installing-aws-account.html`,
  INSTALL_AWSIPI_DOCS_ENTRY: `${DOCS_BASE}/welcome/index.html`,

  INSTALL_AWSUPI_INSTALLER_LATEST: MIRROR_CLIENTS_STABLE,
  INSTALL_AWSUPI_CLI_LATEST: MIRROR_CLIENTS_STABLE,
  INSTALL_AWSUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_aws/installing-aws-user-infra.html`,

  INSTALL_AWS_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_aws/installing-aws-customizations.html`,

  INSTALL_AZUREUPI_GETTING_STARTED: 'https://github.com/openshift/installer/blob/master/docs/user/azure/install_upi.md',
  INSTALL_AZUREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure/installing-azure-default.html`,
  INSTALL_AZURE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_azure/installing-azure-customizations.html`,

  INSTALL_BAREMETAL_UPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html`,
  INSTALL_BAREMETAL_IPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal_ipi/ipi-install-installation-workflow.html`,
  INSTALL_BAREMETAL_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal`,
  INSTALL_BAREMETAL_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal-network-customizations.html`,
  RHCOS_BAREMETAL_ISO_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live.x86_64.iso`,
  RHCOS_BAREMETAL_ISO_S390X: `${MIROR_RHCOS_LATEST_S390X}/rhcos-live.s390x.iso`,
  RHCOS_BAREMETAL_ISO_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live.ppc64le.iso`,
  RHCOS_BAREMETAL_RAW_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-metal.x86_64.raw.gz`,
  RHCOS_BAREMETAL_RAW_S390X: `${MIROR_RHCOS_LATEST_S390X}/rhcos-metal.s390x.raw.gz`,
  RHCOS_BAREMETAL_RAW_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-metal.ppc64le.raw.gz`,

  INSTALL_CRC_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers',
  INSTALL_CRC_DOWNLOAD_WINDOWS: 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/crc/latest/crc-windows-amd64.zip',
  INSTALL_CRC_DOWNLOAD_MACOS: 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/crc/latest/crc-macos-amd64.pkg',
  INSTALL_CRC_DOWNLOAD_LINUX: 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz',

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

  INSTALL_VSPHEREUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html`,
  INSTALL_VSPHEREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere-installer-provisioned.html`,
  INSTALL_VSPHERE_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html#installation-vsphere-machines_installing-vsphere`,
  INSTALL_VSPHERE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere-installer-provisioned-customizations.html`,
  RHCOS_VSPHERE_OVA_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-vmware.x86_64.ova`,

  INSTALL_IBMZ_GETTING_STARTED: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html`,
  INSTALL_IBMZ_RHCOS_LEARN_MORE_RHEL_KVM: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z-kvm.html#installation-user-infra-machines-iso-ibm-z_kvm_installing-ibm-z-kvm`,
  INSTALL_IBMZ_LEARN_MORE_ZVM: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html#installation-user-infra-machines-iso-ibm-z_installing-ibm-z`,
  RHCOS_IBMZ_INITRAMFS: `${MIROR_RHCOS_LATEST_S390X}/rhcos-live-initramfs.s390x.img`,
  RHCOS_IBMZ_KERNEL: `${MIROR_RHCOS_LATEST_S390X}/rhcos-live-kernel-s390x`,
  RHCOS_IBMZ_ROOTFS: `${MIROR_RHCOS_LATEST_S390X}/rhcos-live-rootfs.s390x.img`,
  RHCOS_IBMZ_QCOW: `${MIROR_RHCOS_LATEST_S390X}/rhcos-qemu.s390x.qcow2.gz`,

  INSTALL_RHVIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-default.html`,
  INSTALL_RHV_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-customizations.html`,
  INSTALL_RHVUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-user-infra.html`,

  INSTALL_PRE_RELEASE_BUG_LIST_45: 'https://bugzilla.redhat.com/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&bug_status=POST&bug_status=MODIFIED&columnlist=bug_status%2Ccomponent%2Cshort_desc%2Cassigned_to_realname%2Creporter_realname%2Cchangeddate&keywords=TestBlocker&keywords_type=allwords&known_name=OCP4-3-blocker&list_id=10675364&product=OpenShift%20Container%20Platform&query_based_on=OCP4-4-blocker&query_format=advanced&target_release=4.5.0',
  INSTALL_PRE_RELEASE_INSTALLER_DOC: 'https://github.com/openshift/installer/tree/master/docs/user',
  INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest',
  INSTALL_PRE_RELEASE_FEEDBACK_MAILTO: 'mailto:***REMOVED***?subject=[dev preview build]',
  INSTALL_PRE_RELEASE_SUPPORT_KCS: 'https://access.redhat.com/articles/4307871',

  INSTALL_POWER_GETTING_STARTED: `${DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html`,
  INSTALL_POWER_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html#creating-machines-bare-metal-power`,
  RHCOS_POWER_ISO_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live.ppc64le.iso`,
  RHCOS_POWER_INITRAMFS: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-initramfs.ppc64le.img`,
  RHCOS_POWER_KERNEL: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-kernel-ppc64le`,
  RHCOS_POWER_ROOTFS: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-rootfs.ppc64le.img`,

  OCM_CLI_LATEST: 'https://github.com/openshift-online/ocm-cli/releases/latest',
  OCM_CLI_DOCS: 'https://access.redhat.com/articles/6114701',

  HELM_CLI_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/helm/latest',
  HELM_DOCS: `${DOCS_BASE}/cli_reference/helm_cli/getting-started-with-helm-on-openshift-container-platform.html`,

  ODO_DOCS: `${DOCS_BASE}/cli_reference/developer_cli_odo/understanding-odo.html`,

  ROSA_CLIENT_LATEST: 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/rosa/latest',
  ROSA_DOCS: 'https://docs.openshift.com/rosa/rosa_cli/rosa-get-started-cli.html',

  OCM_DOCS_PULL_SECRETS: `${OCM_DOCS_BASE}/html/managing_clusters/assembly-managing-clusters#downloading_and_updating_pull_secrets`,
};

// See also per-tool data in DownloadButton.jsx.
const tools = {
  CLI_TOOLS: 'CLI_TOOLS',
  CRC: 'CRC',
  HELM: 'HELM',
  INSTALLER: 'INSTALLER',
  OCM: 'OCM',
  ODO: 'ODO',
  RHCOS: 'RHCOS',
  RHOAS: 'RHOAS',
  ROSA: 'ROSA',
};

const channels = {
  PRE_RELEASE: 'preRelease',
  STABLE: 'stable',
};

const architectures = {
  arm: 'arm',
  x86: 'x86',
  ppc: 'ppc',
  s390x: 's390x',
};

const architectureOptions = [
  { value: architectures.x86, label: 'x86_64', path: 'x86_64' }, // aka amd64
  { value: architectures.arm, label: 'arm64', path: 'arm64' },
  { value: architectures.ppc, label: 'ppc64le', path: 'ppc64le' }, // aka Power
  { value: architectures.s390x, label: 's390x', path: 's390x' }, // aka IBM Z
];

const operatingSystems = {
  linux: 'linux',
  mac: 'mac',
  windows: 'windows',
};

const operatingSystemOptions = [
  { value: operatingSystems.linux, label: 'Linux' },
  { value: operatingSystems.mac, label: 'MacOS' },
  { value: operatingSystems.windows, label: 'Windows' },
];

/**
 * {tool: {channel: {arch: {os: url}}}}
 */
const urls = {
  [tools.CLI_TOOLS]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: links.CLI_TOOLS_WINDOWS,
        [operatingSystems.linux]: links.CLI_TOOLS_LINUX,
        [operatingSystems.mac]: links.CLI_TOOLS_MAC,
      },
      [architectures.s390x]: {
        // TODO: what do these mean?
        // Windows and OSX don's run on IBM Z, are these aliases for x86 binaries?
        [operatingSystems.windows]: links.CLI_TOOLS_WINDOWS_IBMZ,
        [operatingSystems.linux]: links.CLI_TOOLS_LINUX_IBMZ,
        [operatingSystems.mac]: links.CLI_TOOLS_MAC_IBMZ,
      },
      [architectures.ppc]: {
        [operatingSystems.windows]: links.CLI_TOOLS_WINDOWS_PPC,
        [operatingSystems.linux]: links.CLI_TOOLS_LINUX_PPC,
        [operatingSystems.mac]: links.CLI_TOOLS_MAC_PPC,
      },
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: links.CLI_TOOLS_WINDOWS_PRE_RELEASE,
        [operatingSystems.linux]: links.CLI_TOOLS_LINUX_PRE_RELEASE,
        [operatingSystems.mac]: links.CLI_TOOLS_MAC_PRE_RELEASE,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_ARM_PRE}/openshift-client-linux-amd64.tar.gz`, // runs on amd64, installs on arm
        [operatingSystems.mac]: `${MIRROR_CLIENTS_ARM_PRE}/openshift-client-mac.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_CLIENTS_ARM_PRE}/openshift-client-windows.zip`,
      },
    },
  },

  [tools.CRC]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: links.INSTALL_CRC_DOWNLOAD_WINDOWS,
        [operatingSystems.mac]: links.INSTALL_CRC_DOWNLOAD_MACOS,
        [operatingSystems.linux]: links.INSTALL_CRC_DOWNLOAD_LINUX,
      },
    },
  },

  [tools.HELM]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${links.HELM_CLI_LATEST}/helm-linux-amd64`,
        [operatingSystems.mac]: `${links.HELM_CLI_LATEST}/helm-darwin-amd64`,
        [operatingSystems.windows]: `${links.HELM_CLI_LATEST}/helm-windows-amd64.exe`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${links.HELM_CLI_LATEST}/helm-linux-s390x`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${links.HELM_CLI_LATEST}/helm-linux-ppc64le`,
      },
    },
  },

  [tools.INSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: links.INSTALLER_LINUX,
        [operatingSystems.mac]: links.INSTALLER_MAC,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: links.INSTALLER_LINUX_IBMZ,
        [operatingSystems.mac]: links.INSTALLER_MAC_IBMZ,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: links.INSTALLER_LINUX_PPC,
        [operatingSystems.mac]: links.INSTALLER_MAC_PPC,
      },
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: links.INSTALLER_LINUX_PRE_RELEASE,
        [operatingSystems.mac]: links.INSTALLER_MAC_PRE_RELEASE,
      },

      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_ARM_PRE}/openshift-install-linux-amd64.tar.gz`, // installs on ARM, runs on x86
        [operatingSystems.mac]: `${MIRROR_CLIENTS_ARM_PRE}/openshift-install-mac.tar.gz`,
      },
    },
  },

  // [tools.OCM] TODO: get URL to latest github release

  [tools.ODO]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-amd64`,
        [operatingSystems.mac]: `${MIRROR_ODO_LATEST}/odo-darwin-amd64`,
        [operatingSystems.windows]: `${MIRROR_ODO_LATEST}/odo-windows-amd64.exe`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-arm64`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-s390x`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-ppc64le`,
      },
    },
  },

  // [tools.RHOAS] TODO: get URL to latest github release

  [tools.ROSA]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${links.ROSA_CLIENT_LATEST}/rosa-linux.tar.gz`,
        [operatingSystems.mac]: `${links.ROSA_CLIENT_LATEST}/rosa-macosx.tar.gz`,
        [operatingSystems.windows]: `${links.ROSA_CLIENT_LATEST}/rosa-windows.zip`,
      },
    },
  },
};

export {
  architectures,
  architectureOptions,
  channels,
  operatingSystems,
  operatingSystemOptions,
  tools,
  urls,
};
export default links;
