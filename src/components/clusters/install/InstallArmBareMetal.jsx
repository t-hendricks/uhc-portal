import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallArmBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal';
  }

  render() {
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
      <>
        <InstructionsChooserPageTitle cloudName="ARM Bare Metal" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/arm/installer-provisioned"
            ipiLearnMoreLink={links.INSTALL_BAREMETAL_IPI_LEARN_MORE}
            upiPageLink="/install/arm/user-provisioned"
            upiLearnMoreLink={links.INSTALL_BAREMETAL_UPI_GETTING_STARTED}
            aiPageLink="/assisted-installer/clusters/~new?useArm=true"
            aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
            providerSpecificFeatures={{
              ipi: [
                'Hosts controlled with baseboard management controller (BMC)',
                'For air-gapped/restricted networks',
              ],
              upi: ['For air-gapped/restricted networks'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallArmBareMetal;
