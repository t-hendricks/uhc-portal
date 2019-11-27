import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import { tollboothActions } from '../../../redux/actions';
import InstructionsIBM from './components/instructions/InstructionsIBM';
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
    return <PageSection><InstructionsIBM token={token} /></PageSection>;
  }
}

InstallIBM.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallIBM);
