import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsGCP from './instructions/InstructionsGCP';
import { scrollToTop } from '../../../common/helpers';

class InstallGCP extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Google Cloud Platform' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsGCP />
        </PageSection>
      </>
    );
  }
}

export default InstallGCP;
