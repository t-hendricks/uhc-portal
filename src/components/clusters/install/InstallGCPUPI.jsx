import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsGCPUPI from './instructions/InstructionsGCPUPI';
import { scrollToTop } from '../../../common/helpers';

class InstallGCPUPI extends Component {
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
        { label: 'OpenShift Container Platform', path: '/install' },
        { label: 'Google Cloud Platform', path: '/install/gcp' },
        { label: 'User-provisioned infrastructure' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection className="ocp-instructions">
          <InstructionsGCPUPI token={token} />
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
