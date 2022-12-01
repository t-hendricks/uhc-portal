import React, { Component } from 'react';
import { PageSection } from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { scrollToTop } from '../../../common/helpers';
import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';

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
          { label: 'Cluster Type', path: '/create' },
          { label: 'Red Hat Virtualization' },
        ]}
      />
    );

    return (
      <>
        <InstructionsChooserPageTitle
          cloudName="Red Hat Virtualization"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsChooser
            ipiPageLink="/install/rhv/installer-provisioned"
            upiPageLink="/install/rhv/user-provisioned"
          />
        </PageSection>
      </>
    );
  }
}

export default InstallRHV;
