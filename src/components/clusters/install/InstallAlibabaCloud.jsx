import React from 'react';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';

import links from '../../../common/installLinks.mjs';
import Breadcrumbs from '../../common/Breadcrumbs';
import ExternalLink from '../../common/ExternalLink';

import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const breadcrumbs = (
  <Breadcrumbs
    path={[
      { label: 'Clusters' },
      { label: 'Cluster Type', path: '/create' },
      { label: 'Alibaba Cloud' },
    ]}
  />
);

const nonTestedPlatformsLink = (
  <>
    For&nbsp;
    <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
      non-tested platforms
    </ExternalLink>
  </>
);

const InstallAlibabaCloud = () => (
  <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Alibaba Cloud">
    <InstructionsChooserPageTitle cloudName="Alibaba Cloud" breadcrumbs={breadcrumbs} />
    <PageSection>
      <InstructionsChooser
        aiPageLink="/assisted-installer/clusters/~new"
        aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
        hideIPI
        ipiPageLink=""
        hideUPI
        upiPageLink=""
        agentBasedPageLink="/install/platform-agnostic/agent-based"
        agentBasedLearnMoreLink={links.INSTALL_AGENT_LEARN_MORE}
        providerSpecificFeatures={{
          abi: [nonTestedPlatformsLink, 'For air-gapped/restricted networks'],
          ai: [nonTestedPlatformsLink],
          upi: [nonTestedPlatformsLink],
        }}
        name="alibaba-cloud"
      />
    </PageSection>
  </AppPage>
);

export default InstallAlibabaCloud;
