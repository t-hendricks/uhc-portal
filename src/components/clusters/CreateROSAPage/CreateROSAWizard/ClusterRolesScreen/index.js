import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import ClusterRolesScreen from './ClusterRolesScreen';
import { getOCMRole, clearGetOcmRoleResponse, getUserOidcConfigurations } from '../rosaActions';

const mapStateToProps = (state) => {
  const { getOCMRoleResponse } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const sharedVpcSettings = valueSelector(state, 'shared_vpc');
  const isSharedVpcSelected = sharedVpcSettings.is_selected;

  let forcedByoOidcType;
  if (isHypershiftSelected) {
    forcedByoOidcType = 'Hypershift';
  } else if (isSharedVpcSelected) {
    forcedByoOidcType = 'SharedVPC';
  }

  return {
    awsAccountID: valueSelector(state, 'associated_aws_id'),
    clusterName: valueSelector(state, 'name'),
    rosaCreationMode: valueSelector(state, 'rosa_roles_provider_creation_mode'),
    customOperatorRolesPrefix: valueSelector(state, 'custom_operator_roles_prefix'),
    byoOidcConfigID: valueSelector(state, 'byo_oidc_config_id'),
    installerRoleArn: valueSelector(state, 'installer_role_arn'),
    sharedVpcRoleArn: sharedVpcSettings?.hosted_zone_role_arn,
    getOCMRoleResponse,
    forcedByoOidcType,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
  getUserOidcConfigurations: (awsAccountID) => dispatch(getUserOidcConfigurations(awsAccountID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ClusterRolesScreen));
