import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import {
  clearGetOcmRoleResponse,
  clearGetUserRoleResponse,
  getOCMRole,
  getUserRole,
} from '~/redux/actions/rosaActions';

import ReviewClusterScreen from './ReviewClusterScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const autoscalingEnabledValue = !!valueSelector(state, 'autoscalingEnabled');
  const installToVPCSelected = valueSelector(state, 'install_to_vpc');
  const configureProxySelected = valueSelector(state, 'configure_proxy');
  const { getUserRoleResponse, getOCMRoleResponse } = state.rosaReducer;
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  return {
    formValues: getFormValues('CreateCluster')(state),
    autoscalingEnabledValue,
    installToVPCSelected,
    configureProxySelected,
    getUserRoleResponse,
    getOCMRoleResponse,
    isHypershiftSelected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserRole: () => dispatch(getUserRole()),
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
});
export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ReviewClusterScreen));
