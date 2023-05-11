import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallIBMZ extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | System/390 64-bit';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'System/390 64-bit' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="System/390 64-bit" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            aiPageLink="/assisted-installer/clusters/~new"
            aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
            upiPageLink="/install/Ibmz/user-provisioned"
            upiLearnMoreLink={links.INSTALL_IbmzUPI_GETTING_STARTED}
            hideIPI
            providerSpecificFeatures={{
              abi: ['For connected or air-gapped/restricted networks'],
              ipi: [
                'Hosts controlled with Ibmz Cloud Provider',
                'For connected or air-gapped/restricted networks',
              ],
              upi: ['For connected or air-gapped/restricted networks'],
            }}
            name="Ibmz"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallIBMZ;
