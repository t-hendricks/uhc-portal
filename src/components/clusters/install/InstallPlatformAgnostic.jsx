import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import ExternalLink from '../../common/ExternalLink';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallPlatformAgnostic extends Component {
  componentDidMount() {
    scrollToTop();
    document.title =
      'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | x86_64 User-Provisioned Infrastructure';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Platform agnostic (x86_64)' },
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

    return (
      <>
        <InstructionsChooserPageTitle
          cloudName="Platform agnostic (x86_64)"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsChooser
            aiPageLink="/assisted-installer/clusters/~new"
            aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
            hideIPI
            upiPageLink="/install/platform-agnostic/user-provisioned"
            upiLearnMoreLink={links.INSTALL_GENERIC_GETTING_STARTED}
            agentBasedPageLink="/install/platform-agnostic/agent-based"
            agentBasedLearnMoreLink={links.INSTALL_AGENT_LEARN_MORE}
            providerSpecificFeatures={{
              abi: [nonTestedPlatformsLink, 'For air-gapped/restricted networks'],
              ai: [nonTestedPlatformsLink],
              upi: [nonTestedPlatformsLink],
            }}
            name="platform-agnostic"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallPlatformAgnostic;
