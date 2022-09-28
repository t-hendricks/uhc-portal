import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import PageTitle from '../../common/PageTitle';
import InstructionsChooser from './instructions/InstructionsChooser';

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
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="Platform agnostic (x86_64)"
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
