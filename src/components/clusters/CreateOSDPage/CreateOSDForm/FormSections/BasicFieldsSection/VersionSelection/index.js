import { connect } from 'react-redux';
import get from 'lodash/get';

import VersionSelection from './VersionSelection';
import { clustersActions } from '../../../../../../../redux/actions/clustersActions';

const mapDispatchToProps = dispatch => ({
  getInstallableVersions: isRosa => dispatch(clustersActions.getInstallableVersions(isRosa)),
});

const mapStateToProps = (state) => {
  const { clusterVersions } = get(state, 'clusters', {});
  return { getInstallableVersionsResponse: clusterVersions };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionSelection);
