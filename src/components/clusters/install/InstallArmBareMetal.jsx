import React, { Component } from 'react';
import {
  PageSection,
} from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import PageTitle from '../../common/PageTitle';
import InstructionsChooser from './instructions/InstructionsChooser';

class InstallArmBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'ARM Bare Metal' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="ARM Bare Metal"
            showAI
            preferAI
            hideIPI
            upiPageLink="/install/arm/user-provisioned"
            aiPageLink="/assisted-installer/clusters/~new?useArm=true"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallArmBareMetal;
