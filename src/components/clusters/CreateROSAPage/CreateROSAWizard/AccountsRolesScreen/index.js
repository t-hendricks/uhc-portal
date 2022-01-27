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
  openAssociateAWSAccountModal: token => dispatch(openModal('associate-aws-modal', token)),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(AccountsRolesScreen));
