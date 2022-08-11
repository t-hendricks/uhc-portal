import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsChooser from './instructions/InstructionsChooser';

import { scrollToTop } from '../../../common/helpers';

class InstallArmAWS extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS (ARM)';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Amazon Web Services (ARM)' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="AWS (ARM)"
            ipiPageLink="/install/aws/arm/installer-provisioned"
            upiPageLink="/install/aws/arm/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallArmAWS;
