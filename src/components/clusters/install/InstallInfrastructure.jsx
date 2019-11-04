import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import { tollboothActions } from '../../../redux/actions';
import InstructionsInfrastructure from './components/instructions/InstructionsInfrastructure';


class InstallInfrastructure extends Component {
  componentDidMount() {
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Infrastructure Provider';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return <PageSection><InstructionsInfrastructure token={token} /></PageSection>;
  }
}

InstallInfrastructure.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallInfrastructure);
