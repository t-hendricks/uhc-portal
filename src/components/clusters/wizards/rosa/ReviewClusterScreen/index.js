import { connect } from 'react-redux';

import {
  clearGetOcmRoleResponse,
  clearGetUserRoleResponse,
  getOCMRole,
  getUserRole,
} from '~/redux/actions/rosaActions';

import ReviewClusterScreen from './ReviewClusterScreen';

const mapStateToProps = (state) => {
  const { getUserRoleResponse, getOCMRoleResponse } = state.rosaReducer;

  return {
    getUserRoleResponse,
    getOCMRoleResponse,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserRole: () => dispatch(getUserRole()),
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewClusterScreen);
