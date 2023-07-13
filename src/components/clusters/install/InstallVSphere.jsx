import React from 'react';
import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '../../common/Breadcrumbs';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

const InstallVSphere = () => {
  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        { label: 'Cluster Type', path: '/create' },
        { label: 'VMware vSphere' },
      ]}
    />
  );

  return (
    <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | vSphere">
      <InstructionsChooserPageTitle cloudName="VMware vSphere" breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          aiPageLink="/assisted-installer/clusters/~new"
          aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
          ipiPageLink="/install/vsphere/installer-provisioned"
          ipiLearnMoreLink={links.INSTALL_VSPHEREIPI_GETTING_STARTED}
          upiPageLink="/install/vsphere/user-provisioned"
          upiLearnMoreLink={links.INSTALL_VSPHEREUPI_GETTING_STARTED}
          agentBasedPageLink="/install/vsphere/agent-based"
          agentBasedLearnMoreLink={links.INSTALL_AGENT_LEARN_MORE}
          providerSpecificFeatures={{
            abi: ['For connected or air-gapped/restricted networks'],
            ipi: [
              'Hosts controlled with vSphere Cloud Provider',
              'For connected or air-gapped/restricted networks',
            ],
            upi: ['For connected or air-gapped/restricted networks'],
          }}
          name="vsphere"
        />
      </PageSection>
    </AppPage>
  );
};

export default InstallVSphere;
