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

  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const installerRoleArn = valueSelector(state, 'installer_role_arn');
  const supportRoleArn = valueSelector(state, 'support_role_arn');
  const workerRoleArn = valueSelector(state, 'worker_role_arn');
  const { getAWSAccountRolesARNsResponse: awsAccountRoleArns } = state.rosaReducer;

  const hasManagedArnsSelected = awsAccountRoleArns?.data?.some(
    (roleGroup) =>
      (roleGroup.managedPolicies || roleGroup.hcpManagedPolicies) &&
      (roleGroup.Installer === installerRoleArn ||
        roleGroup.Support === supportRoleArn ||
        roleGroup.Worker === workerRoleArn),
  );

  return {
    hasManagedArnsSelected,
    isHypershiftSelected,
    rosaMaxOSVersion: valueSelector(state, 'rosa_max_os_version'),
    selectedClusterVersion: valueSelector(state, 'cluster_version'),
    getInstallableVersionsResponse: clusterVersions,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionSelection);
