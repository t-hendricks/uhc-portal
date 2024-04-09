import { connect } from 'react-redux';

import { githubActions } from '../../../../../../redux/actions';

import DownloadAndOSSelection from './DownloadAndOSSelection';

const mapStateToProps = (state) => ({
  token: state.tollbooth.token || {},
  githubReleases: state.githubReleases,
});

const mapDispatchToProps = {
  getLatestRelease: githubActions.getLatestRelease,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadAndOSSelection);
