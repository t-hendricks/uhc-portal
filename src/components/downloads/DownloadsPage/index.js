import { connect } from 'react-redux';
import DownloadsPage from './DownloadsPage';
import { tollboothActions } from '../../../redux/actions';

const mapStateToProps = state => ({
  token: state.tollbooth.token || {},
});

const mapDispatchToProps = () => dispatch => ({
  getAuthToken: () => dispatch(tollboothActions.createAuthToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage);
