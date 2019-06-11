import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsAWSUPI from './components/instructions/InstructionsAWSUPI';
import { scrollToTop } from '../../../common/helpers';

class InstallAWSUPI extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned Infrastructure';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return <InstructionsAWSUPI token={token} />;
  }
}

InstallAWSUPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAWSUPI);
