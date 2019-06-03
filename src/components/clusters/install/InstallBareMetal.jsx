import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tollboothActions } from '../../../redux/actions';
import InstructionsBareMetal from './components/instructions/InstructionsBareMetal';
import { scrollToTop } from '../../../common/helpers';

class InstallBareMetal extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    return <InstructionsBareMetal token={token} />;
  }
}

InstallBareMetal.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallBareMetal);
