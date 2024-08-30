import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';

import { tools } from '../../../common/installLinks.mjs';
import { tollboothActions } from '../../../redux/actions';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import InstructionsPreRelease from './instructions/InstructionsPreRelease';

export class InstallMultiPreRelease extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Cluster List' },
          { label: 'Cluster Type', path: '/create' },
          {
            label:
              'Multi-architecture clusters' /* , path: '/install/multi/installer-provisioned' */,
          },
          { label: 'Pre-Release Builds' },
        ]}
      />
    );

    return (
      <AppPage title="Install OpenShift 4 | Multi-architecture clusters | Experimental Developer Preview Builds">
        <PageTitle
          title="Install OpenShift with multi-architecture compute machines"
          breadcrumbs={breadcrumbs}
        />
        <PageSection>
          <InstructionsPreRelease token={token} installer={tools.MULTIINSTALLER} />
        </PageSection>
      </AppPage>
    );
  }
}

InstallMultiPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallMultiPreRelease);
