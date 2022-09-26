import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import get from 'lodash/get';

import VersionSelection from './VersionSelection';
import { clustersActions } from '../../../../../../../redux/actions/clustersActions';

const mapDispatchToProps = (dispatch) => ({
  getInstallableVersions: (isRosa) => dispatch(clustersActions.getInstallableVersions(isRosa)),
});

const mapStateToProps = (state) => {
  const { clusterVersions } = get(state, 'clusters', {});
  const valueSelector = formValueSelector('CreateCluster');

  return {
    rosaMaxOSVersion: valueSelector(state, 'rosa_max_os_version'),
    selectedClusterVersion: valueSelector(state, 'cluster_version'),
    getInstallableVersionsResponse: clusterVersions,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionSelection);
