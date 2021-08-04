import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PageSection,
} from '@patternfly/react-core';

import Breadcrumbs from '../../common/Breadcrumbs';
import { tollboothActions } from '../../../redux/actions';
import { scrollToTop } from '../../../common/helpers';
import instructionsMapping from './instructions/instructionsMapping';
import OCPInstructions from './instructions/OCPInstructions';
import PageTitle from '../../common/PageTitle';

export class InstallGCPUPI extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP User-Provisioned Infrastructure';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Google Cloud Platform', path: '/install/gcp' },
        { label: 'User-provisioned infrastructure' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title={instructionsMapping.gcp.upi.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            cloudProviderID="gcp"
            customizations={instructionsMapping.gcp.customizations}
            {...instructionsMapping.gcp.upi}
          />
        </PageSection>
      </>
    );
  }
}

InstallGCPUPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallGCPUPI);
