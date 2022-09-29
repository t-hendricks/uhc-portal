import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsChooser from './instructions/InstructionsChooser';
import { scrollToTop } from '../../../common/helpers';

class InstallAzure extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'Microsoft Azure' },
        ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="Azure"
            ipiPageLink="/install/azure/installer-provisioned"
            upiPageLink="/install/azure/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallAzure;
