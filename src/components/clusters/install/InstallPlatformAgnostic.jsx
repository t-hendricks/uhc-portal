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
          { label: 'Create', path: '/create' },
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
            showAI
            hideIPI
            upiPageLink="/install/platform-agnostic/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallPlatformAgnostic;
