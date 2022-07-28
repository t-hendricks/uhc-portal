import React, { Component } from 'react';
import {
  PageSection,
} from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import PageTitle from '../../common/PageTitle';
import InstructionsChooser from './instructions/InstructionsChooser';

class InstallBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Bare Metal' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="Bare Metal"
            showAI
            ipiPageLink="/install/metal/installer-provisioned"
            upiPageLink="/install/metal/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallBareMetal;
