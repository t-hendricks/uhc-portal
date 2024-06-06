import { connect } from 'react-redux';

import {
  clearGetAWSAccountIDsResponse,
  clearGetAWSAccountRolesARNsResponse,
  clearGetUserRoleResponse,
  getAWSAccountIDs,
  getAWSAccountRolesARNs,
  getUserRole,
} from '../../../../../redux/actions/rosaActions';
import { closeModal } from '../../../../common/Modal/ModalActions';

import AccountsRolesScreen from './AccountsRolesScreen';

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  getAWSAccountIDs: (organizationID) => dispatch(getAWSAccountIDs(organizationID)),
  getAWSAccountRolesARNs: (awsAccountID) => dispatch(getAWSAccountRolesARNs(awsAccountID)),
  clearGetAWSAccountIDsResponse: () => dispatch(clearGetAWSAccountIDsResponse()),
  clearGetAWSAccountRolesARNsResponse: () => dispatch(clearGetAWSAccountRolesARNsResponse()),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  getUserRole: () => dispatch(getUserRole()),
});

const mapStateToProps = (state) => {
  const { getAWSAccountIDsResponse, getAWSAccountRolesARNsResponse, getUserRoleResponse } =
    state.rosaReducer;

  return {
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountsRolesScreen);
