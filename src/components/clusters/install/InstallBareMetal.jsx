import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'Bare Metal' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="Bare Metal" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            showAI
            ipiPageLink="/install/metal/installer-provisioned"
            upiPageLink="/install/metal/user-provisioned"
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with baseboard management controller (BMC)'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallBareMetal;
