import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallArmBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'ARM Bare Metal' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="ARM Bare Metal" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            showAI
            ipiPageLink="/install/arm/installer-provisioned"
            upiPageLink="/install/arm/user-provisioned"
            aiPageLink="/assisted-installer/clusters/~new?useArm=true"
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with baseboard management controller (BMC)'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallArmBareMetal;
