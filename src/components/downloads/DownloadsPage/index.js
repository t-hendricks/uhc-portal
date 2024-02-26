import { connect } from 'react-redux';
import DownloadsPage from './DownloadsPage';
import { tollboothActions, githubActions } from '../../../redux/actions';

const mapStateToProps = (state) => ({
  token: state.tollbooth.token || {},
  githubReleases: state.githubReleases,
});

const mapDispatchToProps = {
  getAuthToken: tollboothActions.createAuthToken,
  getLatestRelease: githubActions.getLatestRelease,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage);
