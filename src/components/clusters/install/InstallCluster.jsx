import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import Instructions from './components/instructions/Instructions';


class InstallCluster extends Component {
  componentDidMount() {
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
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
