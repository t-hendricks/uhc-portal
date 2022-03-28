import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsChooser from './instructions/InstructionsChooser';
import { scrollToTop } from '../../../common/helpers';

class InstallASH extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Microsoft Azure Stack Hub' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="Azure Stack Hub"
            ipiPageLink="/install/azure-stack-hub/installer-provisioned"
            upiPageLink="/install/azure-stack-hub/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallASH;
