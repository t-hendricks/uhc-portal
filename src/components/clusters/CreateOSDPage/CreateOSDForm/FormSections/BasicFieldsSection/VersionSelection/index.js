import { connect } from 'react-redux';
import get from 'lodash/get';

import VersionSelection from './VersionSelection';
import { clustersActions } from '../../../../../../../redux/actions/clustersActions';

const mapDispatchToProps = dispatch => ({
  getClusterVersions: () => dispatch(clustersActions.getClusterVersions()),
});

const mapStateToProps = (state) => {
  const { clusterVersions } = get(state, 'clusters', {});
  return { getClusterVersionsResponse: clusterVersions };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionSelection);
