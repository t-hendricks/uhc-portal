import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

class InstallAWS extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'Amazon Web Services' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle cloudName="AWS" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/aws/installer-provisioned"
            upiPageLink="/install/aws/user-provisioned"
            providerSpecificFeatures={{
              ipi: ['Hosts controlled with AWS Cloud Provider'],
            }}
          />
        </PageSection>
      </>
    );
  }
}

export default InstallAWS;
