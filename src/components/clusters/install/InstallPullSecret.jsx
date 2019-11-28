import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import InstructionsPullSecret from './components/instructions/InstructionsPullSecret';

import { scrollToTop } from '../../../common/helpers';


class InstallPullSecret extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Pull Secret';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return (
      <React.Fragment>
        <PageTitle title="Install OpenShift Container Platform 4" />
        <PageSection className="ocp-instructions">
          <InstructionsPullSecret token={token} />
        </PageSection>
      </React.Fragment>
    );
  }
}

InstallPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallPullSecret);
