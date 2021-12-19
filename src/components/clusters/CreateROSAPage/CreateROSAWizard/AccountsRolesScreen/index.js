import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import AccountsRolesScreen from './AccountsRolesScreen';
import { openModal } from '../../../../common/Modal/ModalActions';
import {
  getAWSAccountIDs,
  clearGetAWSAccountIDsResponse,
  getAWSAccountRolesARNs, clearGetAWSAccountRolesARNsResponse,
} from '../rosaActions';

const mapDispatchToProps = dispatch => ({
  openAssociateAWSAccountModal: () => dispatch(openModal('associate-aws-modal')),
  getAWSAccountIDs: () => dispatch(getAWSAccountIDs()),
  getAWSAccountRolesARNs: awsAccountID => dispatch(
    getAWSAccountRolesARNs(awsAccountID),
  ),
  clearGetAWSAccountIDsResponse: () => dispatch(clearGetAWSAccountIDsResponse()),
  clearGetAWSAccountRolesARNsResponse: () => dispatch(clearGetAWSAccountRolesARNsResponse()),
});

const mapStateToProps = (state) => {
  const { getAWSAccountIDsResponse, getAWSAccountRolesARNsResponse } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');

  return {
    selectedAWSAccountID: valueSelector(state, 'associated_aws_id'),
    getAWSAccountIDsResponse,
    getAWSAccountRolesARNsResponse,
    // initialValues: {
    //  associated_aws_id: '234564251',
    //  installer_role_arn: 'arn:aws:iam::{account-id}:role/{installer-role-name}',
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(AccountsRolesScreen));
