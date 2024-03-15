import { connect } from 'react-redux';

import AccountsRolesScreen from './AccountsRolesScreen';
import { closeModal } from '../../../../common/Modal/ModalActions';

import {
  getAWSAccountIDs,
  clearGetAWSAccountIDsResponse,
  getAWSAccountRolesARNs,
  clearGetAWSAccountRolesARNsResponse,
  clearGetUserRoleResponse,
  getUserRole,
} from '../../../../../redux/actions/rosaActions';

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
