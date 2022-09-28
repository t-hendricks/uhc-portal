import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsChooser from './instructions/InstructionsChooser';
import { scrollToTop } from '../../../common/helpers';

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
          { label: 'Create', path: '/create' },
          { label: 'Red Hat Virtualization' },
        ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsChooser
            cloudName="Red Hat Virtualization"
            ipiPageLink="/install/rhv/installer-provisioned"
            upiPageLink="/install/rhv/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallRHV;
