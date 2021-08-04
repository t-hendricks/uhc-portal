import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsPreRelease from './instructions/InstructionsPreRelease';
import { scrollToTop } from '../../../common/helpers';
import { tools } from '../../../common/installLinks';

export class InstallPowerPreRelease extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Power | Experimental Developer Preview Builds';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'Power', path: '/install/power/user-provisioned' },
        { label: 'Pre-Release Builds' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift on Power with user-provisioned infrastructure" breadcrumbs={breadcrumbs} />
        <PageSection>
          <InstructionsPreRelease token={token} installer={tools.PPCINSTALLER} />
        </PageSection>
      </>
    );
  }
}

InstallPowerPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallPowerPreRelease);
