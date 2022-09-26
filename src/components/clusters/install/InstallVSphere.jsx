import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsChooser from './instructions/InstructionsChooser';
import { scrollToTop } from '../../../common/helpers';

class InstallVSphere extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | vSphere';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'VMware vSphere' },
        ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="VMware vSphere"
            showAI
            ipiPageLink="/install/vsphere/installer-provisioned"
            upiPageLink="/install/vsphere/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallVSphere;
