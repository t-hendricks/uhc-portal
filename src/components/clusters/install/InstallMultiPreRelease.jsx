import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsPreRelease from './instructions/InstructionsPreRelease';
import { scrollToTop } from '../../../common/helpers';
import { tools } from '../../../common/installLinks.mjs';

export class InstallMultiPreRelease extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Heterogeneous clusters | Experimental Developer Preview Builds';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Heterogeneous clusters' /* , path: '/install/multi/installer-provisioned' */ },
        { label: 'Pre-Release Builds' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift on heterogeneous infrastructure" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsPreRelease token={token} installer={tools.MULTIINSTALLER} />
        </PageSection>
      </>
    );
  }
}

InstallMultiPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallMultiPreRelease);
