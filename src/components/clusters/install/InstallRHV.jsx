import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallRHV extends Component {
  componentDidMount() {
    scrollToTop();
    document.title =
      'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Red Hat Virtualization';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Red Hat Virtualization' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle
          cloudName="Red Hat Virtualization"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/rhv/installer-provisioned"
            ipiLearnMoreLink={links.INSTALL_RHVIPI_GETTING_STARTED}
            upiPageLink="/install/rhv/user-provisioned"
            upiLearnMoreLink={links.INSTALL_RHVUPI_GETTING_STARTED}
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with Red Hat Virtualization Provider'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallRHV;
