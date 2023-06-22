import React from 'react';
import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const InstallBareMetal = () => {
  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        { label: 'Cluster Type', path: '/create' },
        { label: 'Bare Metal' },
      ]}
    />
  );

  return (
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal">
      <InstructionsChooserPageTitle cloudName="Bare Metal" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          aiPageLink="/assisted-installer/clusters/~new"
          aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
          ipiPageLink="/install/metal/installer-provisioned"
          ipiLearnMoreLink={links.INSTALL_BAREMETAL_IPI_LEARN_MORE}
          upiPageLink="/install/metal/user-provisioned"
          upiLearnMoreLink={links.INSTALL_BAREMETAL_UPI_GETTING_STARTED}
          agentBasedPageLink="/install/metal/agent-based"
          agentBasedLearnMoreLink={links.INSTALL_AGENT_LEARN_MORE}
          providerSpecificFeatures={{
            abi: ['For air-gapped/restricted networks'],
            ipi: [
              'Hosts controlled with baseboard management controller (BMC)',
              'For air-gapped/restricted networks',
            ],
            upi: ['For air-gapped/restricted networks'],
          }}
          name="metal"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallBareMetal;
