import { connect } from 'react-redux';
import {
  formValueSelector,
} from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import ClusterRolesScreen from './ClusterRolesScreen';
import {
  getOCMRole,
  clearGetOcmRoleResponse,
} from '../rosaActions';

const mapStateToProps = (state) => {
  const { getOCMRoleResponse } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');
  return ({
    awsAccountID: valueSelector(state, 'associated_aws_id'),
    clusterName: valueSelector(state, 'name'),
    customOperatorRolesPrefix: valueSelector(state, 'custom_operator_roles_prefix'),
    getOCMRoleResponse,
  });
};

const mapDispatchToProps = dispatch => ({
  getOCMRole: awsAccountID => dispatch(
    getOCMRole(awsAccountID),
  ),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ClusterRolesScreen));
