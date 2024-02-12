import { connect } from 'react-redux';
import DownloadsPage from './DownloadsPage';
import { tollboothActions, githubActions } from '../../../redux/actions';
import { hasRestrictTokensCapability } from '../../CLILoginPage/CLILoginPage';

const mapStateToProps = (state) => ({
  token: state.tollbooth.token || {},
  githubReleases: state.githubReleases,
  restrictOfflineToken: hasRestrictTokensCapability(state),
});

const mapDispatchToProps = {
  getAuthToken: tollboothActions.createAuthToken,
  getLatestRelease: githubActions.getLatestRelease,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage);
