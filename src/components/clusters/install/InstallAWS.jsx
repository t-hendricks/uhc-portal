import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsAWS from './instructions/InstructionsAWS';

import { scrollToTop } from '../../../common/helpers';

class InstallAWS extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Amazon Web Services' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsAWS />
        </PageSection>
      </>
    );
  }
}

export default InstallAWS;
