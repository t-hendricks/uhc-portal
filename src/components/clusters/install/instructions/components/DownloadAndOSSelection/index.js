import { connect } from 'react-redux';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import { githubActions } from '../../../../../../redux/actions';

const mapStateToProps = state => ({
  token: state.tollbooth.token || {},
  githubReleases: state.githubReleases,
});

const mapDispatchToProps = {
  getLatestRelease: githubActions.getLatestRelease,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadAndOSSelection);
