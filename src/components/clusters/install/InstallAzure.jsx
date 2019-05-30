import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsAzure from './components/instructions/InstructionsAzure';


class InstallAzure extends Component {
  componentDidMount() {
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return <InstructionsAzure token={token} />;
  }
}

InstallAzure.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAzure);
