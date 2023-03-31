import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
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
          { label: 'Cluster Type', path: '/create' },
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
            ipiLearnMoreLink={links.INSTALL_ASHIPI_GETTING_STARTED}
            upiPageLink="/install/azure-stack-hub/user-provisioned"
            upiLearnMoreLink={links.INSTALL_ASHUPI_GETTING_STARTED}
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with Azure Provider'],
            }}
            name="azure-stack-hub"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallASH;
