import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import AccountsRolesScreen from './AccountsRolesScreen';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

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
  openUserRoleInstructionsModal: () => dispatch(openModal('user-role-instructions-modal')),
  openOcmRoleInstructionsModal: () => dispatch(openModal('ocm-role-instructions-modal')),
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
    selectedInstallerRoleARN: valueSelector(state, 'installer_role_arn'),
    rosaMaxOSVersion: valueSelector(state, 'rosa_max_os_version'),
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
    isUserRoleModalOpen: shouldShowModal(state, 'user-role-instructions-modal'),
    isOCMRoleModalOpen: shouldShowModal(state, 'ocm-role-instructions-modal'),
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(AccountsRolesScreen));
