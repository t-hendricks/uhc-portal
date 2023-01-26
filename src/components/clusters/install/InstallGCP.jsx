import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallGCP extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Google Cloud Platform' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="GCP" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/gcp/installer-provisioned"
            ipiLearnMoreLink={links.INSTALL_GCPIPI_LEARN_MORE}
            upiPageLink="/install/gcp/user-provisioned"
            upiLearnMoreLink={links.INSTALL_GCPUPI_GETTING_STARTED}
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with Google Cloud Provider'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallGCP;
