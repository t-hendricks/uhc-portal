import React from 'react';
import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const InstallAzure = () => {
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
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure">
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
    </AppPage>
  );
};

export default InstallAzure;
