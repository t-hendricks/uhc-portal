import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallPower extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | PowerPC 64-bit LE';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'PowerPC 64-bit LE' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="PowerPC 64-bit LE" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            aiPageLink="/assisted-installer/clusters/~new"
            aiLearnMoreLink={links.INSTALL_ASSISTED_LEARN_MORE}
            upiPageLink="/install/Power/user-provisioned"
            upiLearnMoreLink={links.INSTALL_IbmzUPI_GETTING_STARTED}
            hideIPI
            providerSpecificFeatures={{
              abi: ['For connected or air-gapped/restricted networks'],
              ipi: [
                'Hosts controlled with PowerPC 64-bit LE Cloud Provider',
                'For connected or air-gapped/restricted networks',
              ],
              upi: ['For connected or air-gapped/restricted networks'],
            }}
            name="Power"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallPower;
