import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

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
          { label: 'Cluster Type', path: '/create' },
          { label: 'Microsoft Azure' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="Azure" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/azure/installer-provisioned"
            ipiLearnMoreLink={links.INSTALL_AZUREIPI_GETTING_STARTED}
            upiPageLink="/install/azure/user-provisioned"
            upiLearnMoreLink={links.INSTALL_AZUREUPI_GETTING_STARTED}
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with Azure Provider'],
            }}
            name="azure"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallAzure;
