import React, { Component } from 'react';
import {
  PageSection,
} from '@patternfly/react-core';

import Breadcrumbs from '../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import PageTitle from '../../common/PageTitle';
import InstructionsBM from './instructions/InstructionsBareMetal';
import instructionsMapping from './instructions/instructionsMapping';

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
        { label: 'OpenShift Container Platform', path: '/install' },
        { label: 'Bare Metal' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title={instructionsMapping.bareMetal.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsBM />
        </PageSection>
      </>
    );
  }
}

export default InstallBareMetal;
