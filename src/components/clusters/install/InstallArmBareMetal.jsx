import React from 'react';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';

import links from '../../../common/installLinks.mjs';
import Breadcrumbs from '../../common/Breadcrumbs';

import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const InstallArmBareMetal = () => {
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
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal">
      <InstructionsChooserPageTitle cloudName="ARM Bare Metal" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          ipiPageLink="/install/arm/installer-provisioned"
          ipiLearnMoreLink={links.INSTALL_BAREMETAL_IPI_LEARN_MORE}
          upiPageLink="/install/arm/user-provisioned"
          upiLearnMoreLink={links.INSTALL_BAREMETAL_UPI_GETTING_STARTED}
          aiPageLink="/assisted-installer/clusters/~new?useArm=true"
          aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
          agentBasedPageLink="/install/arm/agent-based"
          agentBasedLearnMoreLink={links.INSTALL_AGENT_LEARN_MORE}
          providerSpecificFeatures={{
            abi: ['For air-gapped/restricted networks'],
            ipi: [
              'Hosts controlled with baseboard management controller (BMC)',
              'For air-gapped/restricted networks',
            ],
            upi: ['For air-gapped/restricted networks'],
          }}
          name="arm"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallArmBareMetal;
