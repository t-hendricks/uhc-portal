import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

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
          { label: 'Cluster Type', path: '/create' },
          { label: 'VMware vSphere' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="VMware vSphere" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
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
