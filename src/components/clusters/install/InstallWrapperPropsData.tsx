import React from 'react';

import links, { tools } from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

import instructionsMapping from './instructions/instructionsMapping';

const AlibabaCloudPropsLinks = (
  <>
    For&nbsp;
    <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
      non-tested platforms
    </ExternalLink>
  </>
);

// Example of props data for generic install component
export const AlibabaProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Alibaba Cloud',
  providerTitle: 'Alibaba Cloud',
  name: 'alibaba-cloud',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Alibaba Cloud' },
  ],
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  hideIPI: true,
  ipiPageLink: '',
  hideUPI: true,
  upiPageLink: '',
  agentBasedPageLink: '/install/platform-agnostic/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: [AlibabaCloudPropsLinks, 'For air-gapped/restricted networks'],
    ai: [AlibabaCloudPropsLinks],
    upi: [AlibabaCloudPropsLinks],
  },
};

export const ArmAwsProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS (ARM)',
  providerTitle: 'AWS (ARM)',
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with AWS Provider'],
  },
  ipiPageLink: '/install/aws/arm/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_AWSIPI_LEARN_MORE,
  upiPageLink: '/install/aws/arm/user-provisioned',
  upiLearnMoreLink: links.INSTALL_AWSUPI_GETTING_STARTED,
  name: 'aws',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)' },
  ],
};

export const ArmAWSIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS Installer-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.aws.arm.ipi.title,
  customizations: instructionsMapping.aws.customizations,
  cloudProviderId: 'aws',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)', path: '/install/aws/arm' },
    { label: 'Installer-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.aws.arm.ipi,
};

export const ArmAWSUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.aws.arm.upi.title,
  cloudProviderId: 'aws',
  isUPI: true,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)', path: '/install/aws/arm' },
    { label: 'User-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.aws.arm.upi,
};

export const ArmAzureIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Installer-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.azure.arm.ipi.title,
  customizations: instructionsMapping.azure.customizations,
  cloudProviderId: 'azure',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure (ARM)' /* , path: '/install/azure' */ },
    /* { label: 'Installer-provisioned infrastructure' }, */
  ],
  instructionsMapping: instructionsMapping.azure.arm.ipi,
};

export const ArmBareMetalProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal',
  providerTitle: 'ARM Bare Metal',
  name: 'arm',
  ipiPageLink: '/install/arm/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_BAREMETAL_IPI_LEARN_MORE,
  upiPageLink: '/install/arm/user-provisioned',
  upiLearnMoreLink: links.INSTALL_BAREMETAL_UPI_GETTING_STARTED,
  aiPageLink: '/assisted-installer/clusters/~new?useArm=true',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  agentBasedPageLink: '/install/arm/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: ['For air-gapped/restricted networks'],
    ipi: [
      'Hosts controlled with baseboard management controller (BMC)',
      'For air-gapped/restricted networks',
    ],
    upi: ['For air-gapped/restricted networks'],
  },
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal' },
  ],
};

export const ArmBareMetalABIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal Agent-based installer',
  providerTitle: instructionsMapping.baremetal.arm.abi.title,
  cloudProviderId: 'baremetal',
  installationTypeId: 'local-agent-based',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'Local Agent-based' },
  ],
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.arm.abi,
};

export const ArmBareMetalIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.arm.ipi.title,
  cloudProviderId: 'baremetal',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'Installer-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.baremetal.arm.ipi,
};

export const ArmBareMetalUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.arm.upi.title,
  cloudProviderId: 'baremetal',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'User-provisioned infrastructure' },
  ],
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.arm.upi,
};

export const ASHIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.ash.ipi.title,
  cloudProviderId: 'ash',
  customizations: instructionsMapping.ash.customizations,
  instructionsMapping: instructionsMapping.ash.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure Stack Hub', path: '/install/azure-stack-hub' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const ASHUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.ash.upi.title,
  cloudProviderId: 'ash',
  isUPI: true,
  instructionsMapping: instructionsMapping.ash.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure Stack Hub', path: '/install/azure-stack-hub' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const ArmPreReleaseProps = {
  appPageTitle: 'Install OpenShift 4 | ARM | Experimental Developer Preview Builds',
  providerTitle: 'Install OpenShift Container Platform 4 on ARM',
  installer: tools.ARMINSTALLER,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Pre-Release Builds' },
  ],
};

export const AWSIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.aws.x86.ipi.title,
  cloudProviderId: 'aws',
  customizations: instructionsMapping.aws.customizations,
  instructionsMapping: instructionsMapping.aws.x86.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services', path: '/install/aws' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const AWSUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.aws.x86.upi.title,
  cloudProviderId: 'aws',
  isUPI: true,
  instructionsMapping: instructionsMapping.aws.x86.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services', path: '/install/aws' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const GCPProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP',
  providerTitle: 'GCP',
  ipiPageLink: '/install/gcp/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_GCPIPI_LEARN_MORE,
  upiPageLink: '/install/gcp/user-provisioned',
  upiLearnMoreLink: links.INSTALL_GCPUPI_GETTING_STARTED,
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with Google Cloud Provider'],
  },
  name: 'gcp',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform' },
  ],
};

export const GCPIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.gcp.ipi.title,
  cloudProviderId: 'gcp',
  instructionsMapping: instructionsMapping.gcp.ipi,
  customizations: instructionsMapping.gcp.customizations,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform', path: '/install/gcp' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const GCPUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.gcp.upi.title,
  cloudProviderId: 'gcp',
  isUPI: true,
  instructionsMapping: instructionsMapping.gcp.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform', path: '/install/gcp' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const IBMCloudProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Cloud',
  providerTitle: instructionsMapping.ibmCloud.title,
  cloudProviderId: 'ibmCloud',
  instructionsMapping: instructionsMapping.ibmCloud,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Cloud' },
  ],
};

export const IBMZProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x)',
  providerTitle: 'IBM Z (s390x)',
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  upiPageLink: '/install/ibmz/user-provisioned',
  upiLearnMoreLink: links.INSTALL_IBMZ_UPI_GETTING_STARTED,
  agentBasedPageLink: '/install/ibmz/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  hideIPI: true,
  providerSpecificFeatures: {
    abi: ['For connected or air-gapped/restricted networks'],
    ipi: [
      'Hosts controlled with Ibmz Cloud Provider',
      'For connected or air-gapped/restricted networks',
    ],
    upi: ['For connected or air-gapped/restricted networks'],
  },
  name: 'Ibmz',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)' },
  ],
};

export const IBMZABIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x) Agent-based installer',
  providerTitle: instructionsMapping.baremetal.s390x.abi.title,
  cloudProviderId: 'baremetal',
  instructionsMapping: instructionsMapping.baremetal.s390x.abi,
  installationTypeId: 'local-agent-based',
  customizations: instructionsMapping.baremetal.s390x.customizations,
  isUPI: true,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)', path: '/install/ibmz' },
    { label: 'Local Agent-based' },
  ],
};

export const IBMZUPIProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x)',
  providerTitle: instructionsMapping.baremetal.s390x.upi.title,
  cloudProviderId: 'baremetal',
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.s390x.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)', path: '/install/ibmz' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const IBMZPreReleaseProps = {
  appPageTitle: 'Install OpenShift 4 | IBM Z | Experimental Developer Preview Builds',
  providerTitle: 'Install OpenShift on IBM Z with user-provisioned infrastructure',
  installer: tools.IBMZINSTALLER,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z', path: '/install/ibmz/user-provisioned' },
    { label: 'Pre-Release Builds' },
  ],
};
