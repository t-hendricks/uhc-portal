import React from 'react';
import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const InstallRHV = () => {
  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        { label: 'Cluster Type', path: '/create' },
        { label: 'Red Hat Virtualization' },
      ]}
    />
  );

  return (
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Red Hat Virtualization">
      <InstructionsChooserPageTitle cloudName="Red Hat Virtualization" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          ipiPageLink="/install/rhv/installer-provisioned"
          ipiLearnMoreLink={links.INSTALL_RHVIPI_GETTING_STARTED}
          upiPageLink="/install/rhv/user-provisioned"
          upiLearnMoreLink={links.INSTALL_RHVUPI_GETTING_STARTED}
          providerSpecificFeatures={{
            ipi: ['Hosts controlled with Red Hat Virtualization Provider'],
          }}
          name="rhv"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallRHV;
