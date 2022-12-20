import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
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

    return (
      <>
        <InstructionsChooserPageTitle
          cloudName="Platform agnostic (x86_64)"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsChooser
            aiPageLink="/assisted-installer/clusters/~new"
            hideIPI
            upiPageLink="/install/platform-agnostic/user-provisioned"
            agentBasedPageLink="/install/platform-agnostic/agent-based"
            /*
            providerSpecificFeatures={{
              ai: [
                <>
                  For <ExternalLink href="#">non-tested platforms</ExternalLink>
                </>,
              ],
              upi: [
                <>
                  For <ExternalLink href="#">non-tested platforms</ExternalLink>
                </>,
              ],
            }}
            */
            // TODO replace the below string versions with the above JSX versions when we have docs URLs for "non-tested platforms". See https://issues.redhat.com/browse/HAC-2403
            providerSpecificFeatures={{
              ai: ['For non-tested platforms'],
              upi: ['For non-tested platforms'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallPlatformAgnostic;
