import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallASH extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'Microsoft Azure Stack Hub' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="Azure Stack Hub" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/azure-stack-hub/installer-provisioned"
            upiPageLink="/install/azure-stack-hub/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallASH;
