import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import ClusterRolesScreen from './ClusterRolesScreen';
import { getOCMRole, clearGetOcmRoleResponse, getUserOidcConfigurations } from '../rosaActions';

const mapStateToProps = (state) => {
  const { getOCMRoleResponse } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  return {
    awsAccountID: valueSelector(state, 'associated_aws_id'),
    clusterName: valueSelector(state, 'name'),
    rosaCreationMode: valueSelector(state, 'rosa_roles_provider_creation_mode'),
    customOperatorRolesPrefix: valueSelector(state, 'custom_operator_roles_prefix'),
    byoOidcConfigID: valueSelector(state, 'byo_oidc_config_id'),
    getOCMRoleResponse,
    isHypershiftSelected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
  getUserOidcConfigurations: (awsAccountID) => dispatch(getUserOidcConfigurations(awsAccountID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ClusterRolesScreen));
