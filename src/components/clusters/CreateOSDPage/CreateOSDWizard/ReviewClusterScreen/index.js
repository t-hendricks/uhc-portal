import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ReviewClusterScreen from './ReviewClusterScreen';
import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import {
  clearGetUserRoleResponse,
  getUserRole,
  getOCMRole,
  clearGetOcmRoleResponse,
} from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaActions';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const product = valueSelector(state, 'product');
  const canAutoScale = canAutoScaleOnCreateSelector(state, product);
  const autoscalingEnabled = canAutoScale && !!valueSelector(state, 'autoscalingEnabled');
  const installToVPCSelected = valueSelector(state, 'install_to_vpc');
  const configureProxySelected = valueSelector(state, 'configure_proxy');
  const { getUserRoleResponse, getOCMRoleResponse } = state.rosaReducer;
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  return {
    formValues: getFormValues('CreateCluster')(state),
    canAutoScale,
    autoscalingEnabled,
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
