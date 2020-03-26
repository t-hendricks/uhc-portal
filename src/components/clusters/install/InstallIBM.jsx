import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsIBM from './instructions/InstructionsIBM';
import { scrollToTop } from '../../../common/helpers';

class InstallIBM extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z';

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
        { label: 'IBM Z' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection className="ocp-instructions">
          <InstructionsIBM token={token} />
        </PageSection>
      </>
    );
  }
}

InstallIBM.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallIBM);
