import { connect } from 'react-redux';

import { githubActions, tollboothActions } from '../../../redux/actions';

import DownloadsPage from './DownloadsPage';

const mapStateToProps = (state) => ({
  token: state.tollbooth.token || {},
  githubReleases: state.githubReleases,
});

const mapDispatchToProps = {
  getAuthToken: tollboothActions.createAuthToken,
  getLatestRelease: githubActions.getLatestRelease,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage);
