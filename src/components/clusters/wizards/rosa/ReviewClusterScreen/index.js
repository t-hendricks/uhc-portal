import { connect } from 'react-redux';

import { openModal } from '~/components/common/Modal/ModalActions';
import { featureGateSelector } from '~/hooks/useFeatureGate';
import {
  clearGetOcmRoleResponse,
  clearGetUserRoleResponse,
  getOCMRole,
  getUserRole,
} from '~/redux/actions/rosaActions';
import { CREATE_CLUSTER_YAML_EDITOR } from '~/redux/constants/featureConstants';

import ReviewClusterScreen from './ReviewClusterScreen';

const mapStateToProps = (state) => {
  const { getUserRoleResponse, getOCMRoleResponse } = state.rosaReducer;
  return {
    getUserRoleResponse,
    getOCMRoleResponse,
    isCreateClusterYamlEditorEnabled: featureGateSelector(state, CREATE_CLUSTER_YAML_EDITOR),
    createClusterResponse: state.clusters.createdCluster,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserRole: () => dispatch(getUserRole()),
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
  openModal: (name, data) => dispatch(openModal(name, data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewClusterScreen);
