import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsPreRelease from './instructions/InstructionsPreRelease';
import { tools } from '../../../common/installLinks.mjs';
import { AppPage } from '~/components/App/AppPage';

export class InstallIBMZPreRelease extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'IBM Z', path: '/install/ibmz/user-provisioned' },
          { label: 'Pre-Release Builds' },
        ]}
      />
    );

    return (
      <AppPage title="Install OpenShift 4 | IBM Z | Experimental Developer Preview Builds">
        <PageTitle
          title="Install OpenShift on IBM Z with user-provisioned infrastructure"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsPreRelease token={token} installer={tools.IBMZINSTALLER} />
        </PageSection>
      </AppPage>
    );
  }
}

InstallIBMZPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallIBMZPreRelease);
