import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsPreRelease from './components/instructions/InstructionsPreRelease';
import { scrollToTop } from '../../../common/helpers';


class InstallPreRelease extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Experimental Developer Preview Builds';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return <InstructionsPreRelease token={token} />;
  }
}

InstallPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallPreRelease);
