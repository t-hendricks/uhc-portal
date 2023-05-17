import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import AccountsRolesScreen from './AccountsRolesScreen';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';

import {
  getAWSAccountIDs,
  clearGetAWSAccountIDsResponse,
  getAWSAccountRolesARNs,
  clearGetAWSAccountRolesARNsResponse,
  clearGetUserRoleResponse,
  getUserRole,
  setOfflineToken,
} from '../rosaActions';

const mapDispatchToProps = (dispatch) => ({
  openAssociateAWSAccountModal: () => dispatch(openModal('associate-aws-modal')),
  closeModal: () => dispatch(closeModal()),
  getAWSAccountIDs: (organizationID) => dispatch(getAWSAccountIDs(organizationID)),
  getAWSAccountRolesARNs: (awsAccountID) => dispatch(getAWSAccountRolesARNs(awsAccountID)),
  clearGetAWSAccountIDsResponse: () => dispatch(clearGetAWSAccountIDsResponse()),
  clearGetAWSAccountRolesARNsResponse: () => dispatch(clearGetAWSAccountRolesARNsResponse()),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  getUserRole: () => dispatch(getUserRole()),
  setOfflineToken: (token) => dispatch(setOfflineToken(token)),
});

const mapStateToProps = (state) => {
  const {
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
    offlineToken,
  } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');

  return {
    isHypershiftSelected: valueSelector(state, 'hypershift') === 'true',
    selectedAWSAccountID: valueSelector(state, 'associated_aws_id'),
    selectedAWSBillingAccountID: valueSelector(state, 'billing_account_id'),
    selectedInstallerRoleARN: valueSelector(state, 'installer_role_arn'),
    rosaMaxOSVersion: valueSelector(state, 'rosa_max_os_version'),
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(AccountsRolesScreen));
