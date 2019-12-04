import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import Breadcrumbs from './components/Breadcrumbs';

import { tollboothActions } from '../../../redux/actions';
import InstructionsAzure from './components/instructions/InstructionsAzure';
import { scrollToTop } from '../../../common/helpers';

class InstallAzure extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure';

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
        { label: 'Microsoft Azure' },
      ]}
      />
    );

    return (
      <React.Fragment>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection className="ocp-instructions">
          <InstructionsAzure token={token} />
        </PageSection>
      </React.Fragment>
    );
  }
}

InstallAzure.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAzure);
