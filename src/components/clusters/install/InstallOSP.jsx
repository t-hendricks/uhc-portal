import React, { Component } from 'react';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import InstructionsOSP from './instructions/InstructionsOSP';
import { scrollToTop } from '../../../common/helpers';

class InstallOSP extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | OpenStack';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Red Hat OpenStack Platform' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsOSP />
        </PageSection>
      </>
    );
  }
}

export default InstallOSP;
