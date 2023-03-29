import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';

import wizardConnector from '../WizardConnector';
import MachinePoolScreen from './MachinePoolScreen';
import createOSDInitialValues from '../../createOSDInitialValues';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const isMultiAz = valueSelector(state, 'multi_az') === 'true' || isHypershiftSelected;
  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
  const machineType = valueSelector(state, 'machine_type');

  return {
    cloudProviderID,
    isMultiAz,
    product,
    billingModel,
    isByoc,
    machineType,
    isHypershiftSelected,
    canAutoScale: canAutoScaleOnCreateSelector(state, product),
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isMultiAz,
      isByoc,
      isTrialDefault: ownProps.isTrialDefault,
    }),
  };
};

export default connect(mapStateToProps)(wizardConnector(MachinePoolScreen));
