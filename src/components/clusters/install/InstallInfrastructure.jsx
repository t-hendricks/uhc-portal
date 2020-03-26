import React, { Component } from 'react';
import {
  PageSection,
} from '@patternfly/react-core';

import Breadcrumbs from '../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';
import InstructionsInfrastructure from './instructions/InstructionsInfrastructure';


class InstallInfrastructure extends Component {
  componentDidMount() {
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Infrastructure Provider';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'OpenShift Container Platform' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsInfrastructure />
        </PageSection>
      </>
    );
  }
}

export default InstallInfrastructure;
