import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import links from '../../../common/installLinks.mjs';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallOSP extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | OpenStack';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Red Hat OpenStack Platform' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="OpenStack" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/openstack/installer-provisioned"
            ipiLearnMoreLink={links.INSTALL_OSPIPI_GETTING_STARTED}
            upiPageLink="/install/openstack/user-provisioned"
            upiLearnMoreLink={links.INSTALL_OSPUPI_GETTING_STARTED}
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with OpenStack Provider'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallOSP;
