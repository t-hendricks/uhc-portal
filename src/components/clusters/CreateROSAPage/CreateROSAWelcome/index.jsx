import { connect } from 'react-redux';
import CreateROSAWelcome from './CreateROSAWelcome';
import { tollboothActions } from '../../../../redux/actions';

const mapStateToProps = state => ({
  token: state.tollbooth.token || {},
});

const mapDispatchToProps = {
  getAuthToken: tollboothActions.createAuthToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateROSAWelcome);
