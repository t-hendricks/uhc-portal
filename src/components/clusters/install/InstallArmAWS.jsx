import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallArmAWS extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS (ARM)';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'Amazon Web Services (ARM)' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="AWS (ARM)" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/aws/arm/installer-provisioned"
            upiPageLink="/install/aws/arm/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallArmAWS;
