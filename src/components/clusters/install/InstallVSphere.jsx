import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallVSphere extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | vSphere';
  }

  render() {
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
      <>
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
          />
        </PageSection>
      </>
    );
  }
}

export default InstallVSphere;
