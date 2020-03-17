import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import Breadcrumbs from '../common/Breadcrumbs';
import InstructionsAzure from './components/instructions/InstructionsAzure';
import { scrollToTop } from '../../../common/helpers';

class InstallAzure extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'OpenShift Container Platform', path: '/install' },
        { label: 'Microsoft Azure' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsAzure />
        </PageSection>
      </>
    );
  }
}

export default InstallAzure;
