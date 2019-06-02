import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsAWS from './components/instructions/InstructionsAWS';


class InstallAWS extends Component {
  componentDidMount() {
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    return <InstructionsAWS />;
  }
}

InstallAWS.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAWS);
