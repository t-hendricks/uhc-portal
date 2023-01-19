import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooserPageTitle } from '~/components/clusters/install/instructions/InstructionsChooserPageTitle';
import { InstructionsChooser } from '~/components/clusters/install/instructions/InstructionsChooser';

class InstallNutanix extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Nutanix AOS';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Nutanix AOS' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="Nutanix AOS" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            aiPageLink="/assisted-installer/clusters/~new"
            ipiPageLink="/install/nutanix/installer-provisioned"
            upiPageLink=""
            agentBasedPageLink=""
            hideUPI
            recommend="ipi"
            providerSpecificFeatures={{
              ipi: [
                'Hosts controlled with Nutanix AOS Cloud Provider',
                'For connected or air-gapped/restricted networks',
              ],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallNutanix;
