import React from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';
import { AppPage } from '~/components/App/AppPage';

const InstallArmAWS = () => {
  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        { label: 'Cluster Type', path: '/create' },
        { label: 'Amazon Web Services (ARM)' },
      ]}
    />
  );

  return (
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS (ARM)">
      <InstructionsChooserPageTitle cloudName="AWS (ARM)" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          ipiPageLink="/install/aws/arm/installer-provisioned"
          ipiLearnMoreLink={links.INSTALL_AWSIPI_LEARN_MORE}
          upiPageLink="/install/aws/arm/user-provisioned"
          upiLearnMoreLink={links.INSTALL_AWSUPI_GETTING_STARTED}
          providerSpecificFeatures={{
            ipi: ['Hosts controlled with AWS Provider'],
          }}
          name="aws"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallArmAWS;
