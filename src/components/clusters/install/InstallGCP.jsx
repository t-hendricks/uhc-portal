import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsGCP from './components/instructions/InstructionsGCP';
import { scrollToTop } from '../../../common/helpers';

class InstallGCP extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;

    return (
      <InstructionsGCP token={token} />);
  }
}

InstallGCP.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallGCP);
