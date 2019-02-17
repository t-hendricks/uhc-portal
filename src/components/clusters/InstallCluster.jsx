import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../redux/actions';
import { Instructions } from './install';


class InstallCluster extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (!APP_EMBEDDED) {
      dispatch(tollboothActions.createAuthToken());
    }
  }

  render() {
    const { token } = this.props;
    return <Instructions token={token} />;
  }
}

InstallCluster.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallCluster);
