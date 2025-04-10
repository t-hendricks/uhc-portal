import React from 'react';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

import instructionsMapping from './instructions/instructionsMapping';

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
    abi: [
      <>
        For&nbsp;
        <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
          non-tested platforms
        </ExternalLink>
      </>,
      'For air-gapped/restricted networks',
    ],
    ai: [
      <>
        For&nbsp;
        <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
          non-tested platforms
        </ExternalLink>
      </>,
    ],
    upi: [
      <>
        For&nbsp;
        <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
          non-tested platforms
        </ExternalLink>
      </>,
    ],
  },
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
