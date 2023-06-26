import React from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';
import { AppPage } from '~/components/App/AppPage';

const InstallPower = () => {
  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        { label: 'Cluster Type', path: '/create' },
        { label: 'IBM Power (ppc64le)' },
      ]}
    />
  );

  return (
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Power (ppc64le)">
      <InstructionsChooserPageTitle cloudName="IBM Power (ppc64le)" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          aiPageLink="/assisted-installer/clusters/~new"
          aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
          upiPageLink="/install/power/user-provisioned"
          upiLearnMoreLink={links.INSTALL_POWER_UPI_GETTING_STARTED}
          hideIPI
          providerSpecificFeatures={{
            abi: ['For connected or air-gapped/restricted networks'],
            ipi: [
              'Hosts controlled with IBM Power (ppc64le) Cloud Provider',
              'For connected or air-gapped/restricted networks',
            ],
            upi: ['For connected or air-gapped/restricted networks'],
          }}
          name="Power"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallPower;
