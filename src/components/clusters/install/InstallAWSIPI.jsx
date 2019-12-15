import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from './components/Breadcrumbs';

import { tollboothActions } from '../../../redux/actions';
import InstructionsAWSIPI from './components/instructions/InstructionsAWSIPI';
import { scrollToTop } from '../../../common/helpers';

class InstallAWSIPI extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS Installer-Provisioned Infrastructure';

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
        { label: 'Amazon Web Services', path: '/install/aws' },
        { label: 'Installer-Provisioned Infrastructure' },
      ]}
      />
    );

    return (
      <React.Fragment>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection className="ocp-instructions">
          <InstructionsAWSIPI token={token} />
        </PageSection>
      </React.Fragment>
    );
  }
}

InstallAWSIPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAWSIPI);
