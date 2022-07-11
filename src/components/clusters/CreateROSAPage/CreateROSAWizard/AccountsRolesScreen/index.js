import { connect } from 'react-redux';
import { formValueSelector, touch } from 'redux-form';

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
} from '../rosaActions';

const mapDispatchToProps = dispatch => ({
  openAssociateAWSAccountModal: token => dispatch(openModal('associate-aws-modal', token)),
  openUserRoleInstructionsModal: () => dispatch(openModal('user-role-instructions-modal')),
  openOcmRoleInstructionsModal: () => dispatch(openModal('ocm-role-instructions-modal')),
  closeModal: () => dispatch(closeModal()),
  getAWSAccountIDs: organizationID => dispatch(getAWSAccountIDs(organizationID)),
  getAWSAccountRolesARNs: awsAccountID => dispatch(
    getAWSAccountRolesARNs(awsAccountID),
  ),
  clearGetAWSAccountIDsResponse: () => dispatch(clearGetAWSAccountIDsResponse()),
  clearGetAWSAccountRolesARNsResponse: () => dispatch(clearGetAWSAccountRolesARNsResponse()),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  getUserRole: () => dispatch(getUserRole()),
  touchARNsFields: () => {
    dispatch(touch('CreateCluster', 'installer_role_arn'));
    dispatch(touch('CreateCluster', 'support_role_arn'));
    dispatch(touch('CreateCluster', 'control_plane_role_arn'));
    dispatch(touch('CreateCluster', 'worker_role_arn'));
  },
});

const mapStateToProps = (state) => {
  const {
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
  } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');

  return {
    selectedAWSAccountID: valueSelector(state, 'associated_aws_id'),
    selectedInstallerRoleARN: valueSelector(state, 'installer_role_arn'),
    rosaMaxOSVersion: valueSelector(state, 'rosa_max_os_version'),
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    getUserRoleResponse,
    isUserRoleModalOpen: shouldShowModal(state, 'user-role-instructions-modal'),
    isOCMRoleModalOpen: shouldShowModal(state, 'ocm-role-instructions-modal'),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(AccountsRolesScreen));
