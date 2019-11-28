import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import Breadcrumbs from './components/Breadcrumbs';
import InstructionsAWS from './components/instructions/InstructionsAWS';

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
        { label: 'OpenShift Container Platform', path: '/install' },
        { label: 'Amazon Web Services' },
      ]}
      />
    );

    return (
      <React.Fragment>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsAWS />
        </PageSection>
      </React.Fragment>
    );
  }
}

export default InstallAWS;
