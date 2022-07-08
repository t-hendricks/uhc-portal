// This module has .mjs extension to simplify importing from NodeJS scripts.

const MIRROR_BUTANE_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/butane/latest';
const MIRROR_CLIENTS_STABLE_X86 = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp/stable/';
const MIRROR_CLIENTS_STABLE_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp/stable/';
const MIRROR_CLIENTS_STABLE_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/clients/ocp/stable/';
const MIRROR_CLIENTS_STABLE_ARM = 'https://mirror.openshift.com/pub/openshift-v4/aarch64/clients/ocp/stable/';
const MIRROR_CLIENTS_LATEST_PRE_X86 = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp-dev-preview/pre-release/';
const MIRROR_CLIENTS_LATEST_PRE_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/ocp-dev-preview/pre-release/';
const MIRROR_CLIENTS_LATEST_PRE_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/clients/ocp-dev-preview/pre-release/';
const MIRROR_CLIENTS_LATEST_PRE_ARM = 'https://mirror.openshift.com/pub/openshift-v4/aarch64/clients/ocp-dev-preview/pre-release/';
const MIRROR_COREOS_INSTALLER_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/coreos-installer/latest';
const MIRROR_CRC_LATEST = 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/crc/latest';
const MIRROR_HELM_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/helm/latest';
const MIRROR_KN_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/serverless/latest';
const MIRROR_TKN_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/pipeline/latest';
const MIRROR_ODO_LATEST = 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest';
const MIRROR_OSDK_LATEST_X86 = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/operator-sdk/latest';
const MIRROR_OSDK_LATEST_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/clients/operator-sdk/latest';
const MIRROR_OSDK_LATEST_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/clients/operator-sdk/latest';
const MIRROR_OSDK_LATEST_ARM = 'https://mirror.openshift.com/pub/openshift-v4/aarch64/clients/operator-sdk/latest';
const MIRROR_RHCOS_LATEST_X86 = 'https://mirror.openshift.com/pub/openshift-v4/x86_64/dependencies/rhcos/latest';
const MIRROR_RHCOS_LATEST_IBMZ = 'https://mirror.openshift.com/pub/openshift-v4/s390x/dependencies/rhcos/latest';
const MIRROR_RHCOS_LATEST_PPC = 'https://mirror.openshift.com/pub/openshift-v4/ppc64le/dependencies/rhcos/latest';
const MIRROR_RHCOS_LATEST_ARM = 'https://mirror.openshift.com/pub/openshift-v4/aarch64/dependencies/rhcos/latest';
const MIRROR_ROSA_LATEST = 'https://mirror.openshift.com/pub/openshift-v4/clients/rosa/latest';
const MIRROR_MIRROR_REGISTRY_LATEST = 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/mirror-registry/latest';

const DOCS_BASE = 'https://docs.openshift.com/container-platform/4.10';
const OSD_DOCS_BASE = 'https://docs.openshift.com/dedicated';
const ROSA_DOCS_BASE = 'https://docs.openshift.com/rosa';

const COSTMGMT_DOCS_BASE = 'https://access.redhat.com/documentation/en-us/cost_management_service/2022';
const OCM_DOCS_BASE = 'https://access.redhat.com/documentation/en-us/openshift_cluster_manager/2022';

const links = {
  DOCS_ENTRY: `${DOCS_BASE}/welcome/index.html`,

  IDP_HTPASSWD: `${DOCS_BASE}/authentication/identity_providers/configuring-htpasswd-identity-provider.html`,
  IDP_LDAP: `${DOCS_BASE}/authentication/identity_providers/configuring-ldap-identity-provider.html`,
  IDP_GITHUB: `${DOCS_BASE}/authentication/identity_providers/configuring-github-identity-provider.html`,
  IDP_GITLAB: `${DOCS_BASE}/authentication/identity_providers/configuring-gitlab-identity-provider.html`,
  IDP_GOOGLE: `${DOCS_BASE}/authentication/identity_providers/configuring-google-identity-provider.html`,
  IDP_OPENID: `${DOCS_BASE}/authentication/identity_providers/configuring-oidc-identity-provider.html`,
  UNDERSTANDING_AUTHENTICATION: `${DOCS_BASE}/authentication/understanding-authentication.html`,
  UNDERSTANDING_IDENTITY_PROVIDER: `${DOCS_BASE}/authentication/understanding-identity-provider.html`,
  APPLYING_AUTOSCALING: `${DOCS_BASE}/machine_management/applying-autoscaling.html`,
  AWS_SPOT_INSTANCES: `${DOCS_BASE}/machine_management/creating_machinesets/creating-machineset-aws.html#machineset-non-guaranteed-instance_creating-machineset-aws`,
  ENCRYPTING_ETCD: `${DOCS_BASE}/security/encrypting-etcd.html`,
  GETTING_SUPPORT: `${DOCS_BASE}/support/getting-support.html`,
  TELEMETRY_INFORMATION: `${DOCS_BASE}/support/remote_health_monitoring/about-remote-health-monitoring.html`,
  REMOTE_HEALTH_INSIGHTS: `${DOCS_BASE}/support/remote_health_monitoring/using-insights-to-identify-issues-with-your-cluster.html`,
  UPDATING_CLUSTER: `${DOCS_BASE}/updating/updating-cluster-within-minor.html`,
  MIGRATING_FROM_3_TO_4: `${DOCS_BASE}/migrating_from_ocp_3_to_4/about-migrating-from-3-to-4.html`,
  SERVERLESS_ABOUT: `${DOCS_BASE}/serverless/discover/about-serverless.html`,
  SERVICE_MESH_ABOUT: `${DOCS_BASE}/service_mesh/v2x/ossm-architecture.html`,
  VIRT_ABOUT: `${DOCS_BASE}/virt/about-virt.html`,

  SUBSCRIPTION_EVAL_INFORMATION: 'https://access.redhat.com/articles/4389911',

  OSD_DEDICATED_ADMIN_ROLE: `${OSD_DOCS_BASE}/osd_cluster_admin/osd-admin-roles.html`,
  OSD_CCS_AWS: `${OSD_DOCS_BASE}/osd_planning/aws-ccs.html`,
  OSD_CCS_AWS_LIMITS: `${OSD_DOCS_BASE}/osd_planning/aws-ccs.html#aws-limits_aws-ccs`,
  OSD_CCS_AWS_SCP: `${OSD_DOCS_BASE}/osd_planning/aws-ccs.html#ccs-aws-scp_aws-ccs`,
  OSD_CCS_AWS_CUSTOMER_REQ: `${OSD_DOCS_BASE}/osd_planning/aws-ccs.html#ccs-aws-customer-requirements_aws-ccs`,
  OSD_CCS_GCP: `${OSD_DOCS_BASE}/osd_planning/gcp-ccs.html`,
  OSD_CCS_GCP_LIMITS: `${OSD_DOCS_BASE}/osd_planning/gcp-ccs.html#gcp-limits_gcp-ccs`,
  OSD_CCS_GCP_SCP: `${OSD_DOCS_BASE}/osd_planning/gcp-ccs.html#ccs-gcp-customer-procedure_gcp-ccs`,
  OSD_LIFE_CYCLE: `${OSD_DOCS_BASE}/osd_architecture/osd_policy/osd-life-cycle.html`,
  OSD_Z_STREAM: `${OSD_DOCS_BASE}/osd_architecture/osd_policy/osd-life-cycle.html#rosa-patch-versions_osd-life-cycle`,
  OSD_SERVICE_DEFINITION_COMPUTE: `${OSD_DOCS_BASE}/osd_architecture/osd_policy/osd-service-definition.html#compute_osd-service-definition`,
  OSD_ETCD_ENCRYPTION: `${OSD_DOCS_BASE}/osd_architecture/osd_policy/osd-service-definition.html#etcd-encryption_osd-service-definition`,
  OSD_AWS_PRIVATE_CONNECTIONS: `${OSD_DOCS_BASE}/osd_cluster_admin/osd_private_connections/aws-private-connections.html`,
  OSD_PRIVATE_CLUSTER: `${OSD_DOCS_BASE}/osd_cluster_admin/osd_private_connections/private-cluster.html`,
  OSD_CLUSTER_WIDE_PROXY: `${OSD_DOCS_BASE}/networking/configuring-cluster-wide-proxy.html`,

  CLI_TOOLS_OCP_GETTING_STARTED: `${DOCS_BASE}/cli_reference/openshift_cli/getting-started-cli.html`,

  INSTALL_DOCS_ENTRY: `${DOCS_BASE}/installing/index.html`,

  INSTALL_ALIBABAIPI_DOCS_LANDING: `${DOCS_BASE}/installing/installing_alibaba/installing-alibaba-customizations.html`,

  INSTALL_AWSIPI_DOCS_LANDING: `${DOCS_BASE}/installing/installing_aws/installing-aws-account.html`,
  INSTALL_AWSIPI_DOCS_ENTRY: `${DOCS_BASE}/welcome/index.html`,
  INSTALL_AWSUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_aws/installing-aws-user-infra.html`,
  INSTALL_AWS_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_aws/installing-aws-customizations.html`,
  INSTALL_AWS_VPC: `${DOCS_BASE}/installing/installing_aws/installing-aws-vpc.html`,
  INSTALL_AWS_CUSTOM_VPC_REQUIREMENTS: `${DOCS_BASE}/installing/installing_aws/installing-aws-vpc.html#installation-custom-aws-vpc-requirements_installing-aws-vpc`,

  INSTALL_AZUREUPI_GETTING_STARTED: 'https://github.com/openshift/installer/blob/master/docs/user/azure/install_upi.md',
  INSTALL_AZUREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure/installing-azure-default.html`,
  INSTALL_AZURE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_azure/installing-azure-customizations.html`,

  INSTALL_ASHIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure_stack_hub/installing-azure-stack-hub-default.html`,
  INSTALL_ASHUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html`,
  INSTALL_ASHUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html#installation-azure-user-infra-uploading-rhcos_installing-azure-stack-hub-user-infra`,
  INSTALL_ASH_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_azure_stack_hub/installing-azure-stack-hub-network-customizations.html`,
  RHCOS_ASHUPI_VHD_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-azurestack.x86_64.vhd.gz`,

  INSTALL_BAREMETAL_UPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html`,
  INSTALL_BAREMETAL_IPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_bare_metal_ipi/ipi-install-installation-workflow.html`,
  INSTALL_BAREMETAL_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal`,
  INSTALL_BAREMETAL_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_bare_metal/installing-bare-metal-network-customizations.html`,
  RHCOS_BAREMETAL_ISO_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live.x86_64.iso`,
  RHCOS_BAREMETAL_RAW_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-metal.x86_64.raw.gz`,

  INSTALL_CRC_GETTING_STARTED: 'https://access.redhat.com/documentation/en-us/red_hat_openshift_local',

  INSTALL_GCPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-account.html`,
  INSTALL_GCPUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html`,
  INSTALL_GCPUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-user-infra.html#installation-gcp-user-infra-rhcos_installing-gcp-user-infra`,
  INSTALL_GCP_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-customizations.html`,
  INSTALL_GCP_VPC: `${DOCS_BASE}/installing/installing_gcp/installing-gcp-vpc.html`,
  RHCOS_GCPUPI_TAR_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-gcp.x86_64.tar.gz`,

  INSTALL_OSPIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,
  INSTALL_OSPUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-user.html`,
  INSTALL_OSPUPI_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-user.html#installation-osp-creating-image_installing-openstack-user`,
  INSTALL_OSP_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_openstack/installing-openstack-installer-custom.html`,
  RHCOS_OSPUPI_QCOW_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-openstack.x86_64.qcow2.gz`,
  RHCOS_OSPUPI_QCOW_PPC: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-openstack.ppc64le.qcow2.gz`,

  INSTALL_VSPHEREUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html`,
  INSTALL_VSPHEREIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere-installer-provisioned.html`,
  INSTALL_VSPHERE_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere.html#installation-vsphere-machines_installing-vsphere`,
  INSTALL_VSPHERE_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_vsphere/installing-vsphere-installer-provisioned-customizations.html`,
  RHCOS_VSPHERE_OVA_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-vmware.x86_64.ova`,

  INSTALL_IBM_CLOUD_GETTING_STARTED: `${DOCS_BASE}/installing/installing_ibm_cloud_public/preparing-to-install-on-ibm-cloud.html`,
  INSTALL_IBMZ_GETTING_STARTED: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html`,
  INSTALL_IBMZ_RHCOS_LEARN_MORE_RHEL_KVM: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z-kvm.html#installation-user-infra-machines-iso-ibm-z_kvm_installing-ibm-z-kvm`,
  INSTALL_IBMZ_LEARN_MORE_ZVM: `${DOCS_BASE}/installing/installing_ibm_z/installing-ibm-z.html#installation-user-infra-machines-iso-ibm-z_installing-ibm-z`,
  RHCOS_IBMZ_ISO: `${MIRROR_RHCOS_LATEST_IBMZ}/rhcos-live.s390x.iso`,
  RHCOS_IBMZ_INITRAMFS: `${MIRROR_RHCOS_LATEST_IBMZ}/rhcos-live-initramfs.s390x.img`,
  RHCOS_IBMZ_KERNEL: `${MIRROR_RHCOS_LATEST_IBMZ}/rhcos-live-kernel-s390x`,
  RHCOS_IBMZ_ROOTFS: `${MIRROR_RHCOS_LATEST_IBMZ}/rhcos-live-rootfs.s390x.img`,
  RHCOS_IBMZ_QCOW: `${MIRROR_RHCOS_LATEST_IBMZ}/rhcos-qemu.s390x.qcow2.gz`,

  INSTALL_RHVIPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-default.html`,
  INSTALL_RHV_CUSTOMIZATIONS: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-customizations.html`,
  INSTALL_RHVUPI_GETTING_STARTED: `${DOCS_BASE}/installing/installing_rhv/installing-rhv-user-infra.html`,

  INSTALL_GENERIC_GETTING_STARTED: `${DOCS_BASE}/installing/installing_platform_agnostic/installing-platform-agnostic.html`,
  INSTALL_GENERIC_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_platform_agnostic/installing-platform-agnostic.html#creating-machines-platform-agnostic`,
  RHCOS_GENERIC_ISO_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live.x86_64.iso`,
  RHCOS_GENERIC_KERNEL_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live-kernel-x86_64`,
  RHCOS_GENERIC_INITRAMFS_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live-initramfs.x86_64.img`,
  RHCOS_GENERIC_ROOTFS_X86: `${MIRROR_RHCOS_LATEST_X86}/rhcos-live-rootfs.x86_64.img`,

  INSTALL_PRE_RELEASE_BUG_LIST_45: 'https://bugzilla.redhat.com/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&bug_status=POST&bug_status=MODIFIED&columnlist=bug_status%2Ccomponent%2Cshort_desc%2Cassigned_to_realname%2Creporter_realname%2Cchangeddate&keywords=TestBlocker&keywords_type=allwords&known_name=OCP4-3-blocker&list_id=10675364&product=OpenShift%20Container%20Platform&query_based_on=OCP4-4-blocker&query_format=advanced&target_release=4.5.0',
  INSTALL_PRE_RELEASE_INSTALLER_DOC: 'https://github.com/openshift/installer/tree/master/docs/user',
  INSTALL_PRE_RELEASE_FEEDBACK_MAILTO: 'mailto:***REMOVED***?subject=[dev preview build]',
  INSTALL_PRE_RELEASE_SUPPORT_KCS: 'https://access.redhat.com/articles/4307871',

  INSTALL_POWER_GETTING_STARTED: `${DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html`,
  INSTALL_POWER_RHCOS_LEARN_MORE: `${DOCS_BASE}/installing/installing_ibm_power/installing-ibm-power.html#creating-machines-bare-metal-power`,
  RHCOS_POWER_ISO: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live.ppc64le.iso`,
  RHCOS_POWER_INITRAMFS: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-initramfs.ppc64le.img`,
  RHCOS_POWER_KERNEL: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-kernel-ppc64le`,
  RHCOS_POWER_ROOTFS: `${MIRROR_RHCOS_LATEST_PPC}/rhcos-live-rootfs.ppc64le.img`,

  RHCOS_ARM_ISO: `${MIRROR_RHCOS_LATEST_ARM}/rhcos-live.aarch64.iso`,
  RHCOS_ARM_INITRAMFS: `${MIRROR_RHCOS_LATEST_ARM}/rhcos-live-initramfs.aarch64.img`,
  RHCOS_ARM_KERNEL: `${MIRROR_RHCOS_LATEST_ARM}/rhcos-live-kernel-aarch64`,
  RHCOS_ARM_ROOTFS: `${MIRROR_RHCOS_LATEST_ARM}/rhcos-live-rootfs.aarch64.img`,
  RHCOS_ARM_RAW: `${MIRROR_RHCOS_LATEST_ARM}/rhcos-metal.aarch64.raw.gz`,

  OCM_CLI_DOCS: 'https://access.redhat.com/articles/6114701',
  OCM_CLI_RELEASES_LATEST: 'https://github.com/openshift-online/ocm-cli/releases/latest',

  RHOAS_CLI_DOCS: 'https://access.redhat.com/documentation/en-us/red_hat_openshift_streams_for_apache_kafka/1/guide/88e1487a-2a14-4b35-85b9-a7a2d67a37f3',
  RHOAS_CLI_RELEASES_LATEST: 'https://github.com/redhat-developer/app-services-cli/releases/latest',

  HELM_DOCS: `${DOCS_BASE}/applications/working_with_helm_charts/understanding-helm.html`,

  KN_DOCS: `${DOCS_BASE}/cli_reference/kn-cli-tools.html`,

  TKN_DOCS: `${DOCS_BASE}/cli_reference/tkn_cli/installing-tkn.html#installing-tkn`,

  ODO_DOCS: `${DOCS_BASE}/cli_reference/developer_cli_odo/understanding-odo.html`,

  OPM_DOCS: `${DOCS_BASE}/cli_reference/opm/cli-opm-install.html`,

  OSDK_DOCS: `${DOCS_BASE}/cli_reference/osdk/cli-osdk-install.html`,

  BUTANE_DOCS: `${DOCS_BASE}/installing/install_config/installing-customizing.html`,

  COREOS_INSTALLER_DOCS: `${DOCS_BASE}/installing/installing_platform_agnostic/installing-platform-agnostic.html`,

  INSTALL_MIRROR_REGISTRY_LEARN_MORE: `${DOCS_BASE}/installing/disconnected_install/installing-mirroring-installation-images.html#installation-about-mirror-registry_installing-mirroring-installation-images`,
  INSTALL_OC_MIRROR_PLUGIN_LEARN_MORE: `${DOCS_BASE}/installing/disconnected_install/installing-mirroring-disconnected.html`,

  ROSA_DOCS_ENTRY: `${ROSA_DOCS_BASE}/welcome/index.html`,
  ROSA_MONITORING: `${ROSA_DOCS_BASE}/rosa_cluster_admin/rosa_monitoring/rosa-understanding-the-monitoring-stack.html`,
  ROSA_AUTOSCALING: `${ROSA_DOCS_BASE}/rosa_cluster_admin/rosa_nodes/rosa-nodes-about-autoscaling-nodes.html`,
  ROSA_CLI_DOCS: `${ROSA_DOCS_BASE}/rosa_cli/rosa-get-started-cli.html`,
  ROSA_AWS_PREREQUISITES: `${ROSA_DOCS_BASE}/rosa_install_access_delete_clusters/rosa_getting_started_iam/rosa-aws-prereqs.html`,
  ROSA_INSTALLING: `${ROSA_DOCS_BASE}/rosa_install_access_delete_clusters/rosa_getting_started_iam/rosa-installing-rosa.html`,
  ROSA_LIFE_CYCLE: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-life-cycle.html`,
  ROSA_Z_STREAM: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-life-cycle.html#rosa-patch-versions_rosa-life-cycle`,
  ROSA_RESPONSIBILITY_MATRIX: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-policy-responsibility-matrix.html`,
  ROSA_SERVICE_DEFINITION: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html`,
  ROSA_WORKER_NODE_COUNT: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html#rosa-sdpolicy-compute_rosa-service-definition`,
  ROSA_SERVICE_ETCD_ENCRYPTION: `${ROSA_DOCS_BASE}/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html#rosa-sdpolicy-etcd-encryption_rosa-service-definition`,
  ROSA_CLUSTER_WIDE_PROXY: `${ROSA_DOCS_BASE}/networking/configuring-cluster-wide-proxy.html`,

  ROSA_AWS_STS_PREREQUISITES: `${ROSA_DOCS_BASE}/rosa_planning/rosa-sts-aws-prereqs.html`,
  ROSA_AWS_ACCOUNT_ASSOCIATION: `${ROSA_DOCS_BASE}/rosa_planning/rosa-sts-aws-prereqs.html#rosa-associating-account_rosa-sts-aws-prereqs`,
  ROSA_AWS_MULTIPLE_ACCOUNT_ASSOCIATION: `${ROSA_DOCS_BASE}/rosa_planning/rosa-sts-aws-prereqs.html#rosa-associating-multiple-account_rosa-sts-aws-prereqs`,
  ROSA_AWS_SERVICE_QUOTAS: `${ROSA_DOCS_BASE}/rosa_planning/rosa-sts-required-aws-service-quotas.html`,
  ROSA_AWS_IAM_RESOURCES: `${ROSA_DOCS_BASE}/rosa_architecture/rosa-sts-about-iam-resources.html`,
  ROSA_AWS_IAM_ROLES: `${ROSA_DOCS_BASE}/rosa_architecture/rosa-sts-about-iam-resources.html#rosa-sts-account-wide-roles-and-policies_rosa-sts-about-iam-resources`,
  ROSA_AWS_ACCOUNT_ROLES: `${ROSA_DOCS_BASE}/rosa_architecture/rosa-sts-about-iam-resources.html#rosa-sts-understanding-ocm-role_rosa-sts-about-iam-resources`,
  ROSA_AWS_OPERATOR_ROLE_PREFIX: `${ROSA_DOCS_BASE}/rosa_architecture/rosa-sts-about-iam-resources.html#rosa-sts-about-operator-role-prefixes_rosa-sts-about-iam-resources`,
  AWS_CONSOLE: 'https://console.aws.amazon.com/rosa/home',
  AWS_CLI: 'https://aws.amazon.com/cli/',

  OCM_DOCS_PULL_SECRETS: `${OCM_DOCS_BASE}/html/managing_clusters/assembly-managing-clusters#downloading_and_updating_pull_secrets`,
  // TODO OCM RBAC phase 2: update this link once the new chapter is there.
  OCM_DOCS_ROLES_AND_ACCESS: `${OCM_DOCS_BASE}/html/managing_clusters/index`,
  OCM_DOCS_SUBSCRIPTIONS: `${OCM_DOCS_BASE}/html/managing_clusters/assembly-cluster-subscriptions`,
  OCM_DOCS_UPGRADING_OSD_TRIAL: `${OCM_DOCS_BASE}/html/managing_clusters/assembly-cluster-subscriptions#upgrading-osd-trial-cluster_assembly-cluster-subscriptions`,

  COSTMGMT_ADDING_OCP: `${COSTMGMT_DOCS_BASE}/html/adding_an_openshift_container_platform_source_to_cost_management/assembly-adding-openshift-container-platform-source`,

  FINDING_AWS_ACCOUNT_IDENTIFIERS: 'https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html',
};

// Tool identifiers are public — e.g. for linking to specific tool in DownloadsPage.
// For consistency, they should be the CLI binary name, where possible.
// See also per-tool data in DownloadButton.jsx.
const tools = {
  OC: 'oc',
  BUTANE: 'butane',
  COREOS_INSTALLER: 'coreos-installer',
  CRC: 'crc',
  HELM: 'helm',
  X86INSTALLER: 'x86_64-openshift-install',
  IBMZINSTALLER: 's390x-openshift-install',
  PPCINSTALLER: 'ppc64le-openshift-install',
  ARMINSTALLER: 'aarch64-openshift-install',
  KN: 'kn',
  OCM: 'ocm',
  ODO: 'odo',
  OPM: 'opm',
  OPERATOR_SDK: 'operator-sdk',
  RHCOS: 'rhcos',
  RHOAS: 'rhoas',
  ROSA: 'rosa',
  MIRROR_REGISTRY: 'mirror-registry',
  OC_MIRROR_PLUGIN: 'oc-mirror-plugin',
  TKN: 'tkn',
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
  { value: architectures.arm, label: 'aarch64', path: 'aarch64' }, // aka arm64
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
 * Static subset of urls, see `urlsSelector` for complete data.
 * {tool: {channel: {arch: {os: url}}}}
 */
const urls = {
  [tools.OC]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: `${MIRROR_CLIENTS_STABLE_X86}openshift-client-windows.zip`,
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_X86}openshift-client-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_X86}openshift-client-mac.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-client-linux.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_PPC}openshift-client-linux.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-client-linux.tar.gz`,
        /*
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-client-mac-arm64.tar.gz`,
        */
      },
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-client-windows.zip`,
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-client-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-client-mac.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_IBMZ}openshift-client-linux.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_PPC}openshift-client-linux.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-client-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-client-mac-arm64.tar.gz`,
      },
    },
  },

  [tools.BUTANE]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_BUTANE_LATEST}/butane-amd64`,
        [operatingSystems.mac]: `${MIRROR_BUTANE_LATEST}/butane-darwin-amd64`,
        [operatingSystems.windows]: `${MIRROR_BUTANE_LATEST}/butane-windows-amd64.exe`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_BUTANE_LATEST}/butane-s390x`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_BUTANE_LATEST}/butane-ppc64le`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_BUTANE_LATEST}/butane-aarch64`,
      },
    },
  },

  [tools.COREOS_INSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_COREOS_INSTALLER_LATEST}/coreos-installer_amd64`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_COREOS_INSTALLER_LATEST}/coreos-installer_s390x`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_COREOS_INSTALLER_LATEST}/coreos-installer_ppc64le`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_COREOS_INSTALLER_LATEST}/coreos-installer_arm64`,
      },
    },
  },

  [tools.CRC]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.windows]: `${MIRROR_CRC_LATEST}/crc-windows-installer.zip`,
        [operatingSystems.mac]: `${MIRROR_CRC_LATEST}/crc-macos-installer.pkg`,
        [operatingSystems.linux]: `${MIRROR_CRC_LATEST}/crc-linux-amd64.tar.xz`,
      },
    },
  },

  [tools.HELM]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_HELM_LATEST}/helm-linux-amd64`,
        [operatingSystems.mac]: `${MIRROR_HELM_LATEST}/helm-darwin-amd64`,
        [operatingSystems.windows]: `${MIRROR_HELM_LATEST}/helm-windows-amd64.exe`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_HELM_LATEST}/helm-linux-s390x`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_HELM_LATEST}/helm-linux-ppc64le`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_HELM_LATEST}/helm-linux-arm64`,
      },
    },
  },

  [tools.X86INSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_X86}openshift-install-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_X86}openshift-install-mac.tar.gz`,
      },
      /*
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_X86}openshift-install-mac-arm64.tar.gz`,
      },
      */
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-install-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-install-mac.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_X86}openshift-install-mac-arm64.tar.gz`,
      },
    },
  },
  [tools.IBMZINSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-mac.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-linux.tar.gz`,
      },
      /*
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_IBMZ}openshift-install-mac-arm64.tar.gz`,
      },
      */
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_IBMZ}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_IBMZ}openshift-install-mac.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_IBMZ}openshift-install-linux.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_IBMZ}openshift-install-mac-arm64.tar.gz`,
      },
    },
  },
  [tools.PPCINSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-mac.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-linux.tar.gz`,
      },
      /*
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_PPC}openshift-install-mac-arm64.tar.gz`,
      },
      */
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_PPC}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_PPC}openshift-install-mac.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_PPC}openshift-install-linux.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_PPC}openshift-install-mac-arm64.tar.gz`,
      },
    },
  },
  [tools.ARMINSTALLER]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-install-mac.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-install-linux.tar.gz`,
        /*
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_ARM}openshift-install-mac-arm64.tar.gz`,
        */
      },
    },
    [channels.PRE_RELEASE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-install-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-install-mac.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-install-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_LATEST_PRE_ARM}openshift-install-mac-arm64.tar.gz`,
      },
    },
  },

  [tools.KN]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_KN_LATEST}/kn-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_KN_LATEST}/kn-macos-amd64.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_KN_LATEST}/kn-windows-amd64.zip`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_KN_LATEST}/kn-linux-s390x.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_KN_LATEST}/kn-linux-ppc64le.tar.gz`,
      },
    },
  },

  [tools.TKN]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_TKN_LATEST}/tkn-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_TKN_LATEST}/tkn-macos-amd64.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_TKN_LATEST}/tkn-windows-amd64.zip`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_TKN_LATEST}/tkn-linux-s390x.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_TKN_LATEST}/tkn-linux-ppc64le.tar.gz`,
      },
    },
  },

  [tools.ODO]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-amd64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_ODO_LATEST}/odo-darwin-amd64.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_ODO_LATEST}/odo-windows-amd64.exe.zip`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-arm64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_ODO_LATEST}/odo-darwin-arm64.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-s390x.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_ODO_LATEST}/odo-linux-ppc64le.tar.gz`,
      },
    },
  },

  [tools.ROSA]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_ROSA_LATEST}/rosa-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_ROSA_LATEST}/rosa-macosx.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_ROSA_LATEST}/rosa-windows.zip`,
      },
    },
  },

  [tools.OPM]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_X86}opm-linux.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_CLIENTS_STABLE_X86}opm-mac.tar.gz`,
        [operatingSystems.windows]: `${MIRROR_CLIENTS_STABLE_X86}opm-windows.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_IBMZ}opm-linux.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_PPC}opm-linux.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_ARM}opm-linux.tar.gz`,
      },
    },
  },

  [tools.OPERATOR_SDK]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_OSDK_LATEST_X86}/operator-sdk-linux-x86_64.tar.gz`,
        [operatingSystems.mac]: `${MIRROR_OSDK_LATEST_X86}/operator-sdk-darwin-x86_64.tar.gz`,
      },
      [architectures.arm]: {
        [operatingSystems.linux]: `${MIRROR_OSDK_LATEST_ARM}/operator-sdk-linux-aarch64.tar.gz`,
      },
      [architectures.s390x]: {
        [operatingSystems.linux]: `${MIRROR_OSDK_LATEST_IBMZ}/operator-sdk-linux-s390x.tar.gz`,
      },
      [architectures.ppc]: {
        [operatingSystems.linux]: `${MIRROR_OSDK_LATEST_PPC}/operator-sdk-linux-ppc64le.tar.gz`,
      },
    },
  },

  [tools.MIRROR_REGISTRY]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_MIRROR_REGISTRY_LATEST}/mirror-registry.tar.gz`,
      },
    },
  },
  [tools.OC_MIRROR_PLUGIN]: {
    [channels.STABLE]: {
      [architectures.x86]: {
        [operatingSystems.linux]: `${MIRROR_CLIENTS_STABLE_X86}oc-mirror.tar.gz`,
      },
    },
  },
};

const githubReleasesToFetch = [
  'openshift-online/ocm-cli',
  'redhat-developer/app-services-cli',
];

/**
 * Computes full urls data.
 * @param state.githubReleases.
 * @return {tool: {
 *   channel: {
 *     arch: {os: url}},
 *     fallbackNavigateURL: '...' // Optional, used when arch/os data missing. Open in new tab.
 *   },
 * }
 */
const urlsSelector = (githubReleases) => {
  const result = {
    ...urls,
    [tools.OCM]: {
      [channels.STABLE]: {
        fallbackNavigateURL: links.OCM_CLI_RELEASES_LATEST,
      },
    },
    [tools.RHOAS]: {
      [channels.STABLE]: {
        fallbackNavigateURL: links.RHOAS_CLI_RELEASES_LATEST,
      },
    },
  };

  const ocmRelease = githubReleases['openshift-online/ocm-cli'];
  if (ocmRelease?.fulfilled) {
    const tag = ocmRelease.data.tag_name;
    const base = `https://github.com/openshift-online/ocm-cli/releases/download/${tag}`;
    result[tools.OCM] = {
      [channels.STABLE]: {
        [architectures.x86]: {
          [operatingSystems.linux]: `${base}/ocm-linux-amd64`,
          [operatingSystems.mac]: `${base}/ocm-darwin-amd64`,
          [operatingSystems.windows]: `${base}/ocm-windows-amd64`,
        },
        [architectures.s390x]: {
          [operatingSystems.linux]: `${base}/ocm-linux-s390x`,
        },
        [architectures.ppc]: {
          [operatingSystems.linux]: `${base}/ocm-linux-ppc64le`,
        },
        [architectures.arm]: {
          [operatingSystems.linux]: `${base}/ocm-linux-arm64`,
        },
      },
    };
  }

  const rhoasRelease = githubReleases['redhat-developer/app-services-cli'];
  if (rhoasRelease?.fulfilled) {
    const tag = rhoasRelease.data.tag_name; // v0.25.0
    const version = tag.replace(/^v/, ''); // 0.25.0
    const base = `https://github.com/redhat-developer/app-services-cli/releases/download/${tag}`;
    result[tools.RHOAS] = {
      [channels.STABLE]: {
        [architectures.x86]: {
          [operatingSystems.linux]: `${base}/rhoas_${version}_linux_amd64.tar.gz`,
          [operatingSystems.mac]: `${base}/rhoas_${version}_macOS_amd64.tar.gz`,
          [operatingSystems.windows]: `${base}/rhoas_${version}_windows_amd64.zip`,
        },
        [architectures.arm]: {
          [operatingSystems.linux]: `${base}/rhoas_${version}_linux_arm64.tar.gz`,
          [operatingSystems.mac]: `${base}/rhoas_${version}_macOS_arm64.tar.gz`,
        },
      },
    };
  }

  return result;
};

/** Useful for scripted checking of "all" external links. */
const getFlatUrls = async () => {
  const urlSet = new Set([
    ...Object.values(links),
    ...Object.values(urls).flatMap(Object.values).flatMap(Object.values).flatMap(Object.values),
    // TODO: include latest github releases?
  ]);
  return [...urlSet].sort();
};

export {
  architectures,
  architectureOptions,
  channels,
  operatingSystems,
  operatingSystemOptions,
  tools,
  urls,
  githubReleasesToFetch,
  urlsSelector,
  getFlatUrls,
};
export default links;
