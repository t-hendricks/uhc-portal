import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';

import wizardConnector from '../WizardConnector';
import MachinePoolScreen from './MachinePoolScreen';
import createOSDInitialValues from '../../createOSDInitialValues';
import {
  getMinNodesRequired,
  getNodeIncrement,
  getMinNodesRequiredHypershift,
  getNodeIncrementHypershift,
} from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsHelper';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
  const machineType = valueSelector(state, 'machine_type');
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const selectedVPCID = valueSelector(state, 'selected_vpc_id');
  const clusterVersionRawId = valueSelector(state, 'cluster_version.raw_id');
  const imds = valueSelector(state, 'imds');
  const machinePools = valueSelector(state, 'machine_pools_subnets');

  return {
    cloudProviderID,
    isMultiAz,
    product,
    billingModel,
    isByoc,
    machineType,
    isHypershiftSelected,
    selectedVPCID,
    imds,
    clusterVersionRawId,
    minNodesRequired: isHypershiftSelected
      ? getMinNodesRequiredHypershift(machinePools?.length)
      : getMinNodesRequired(true, isByoc, isMultiAz),
    nodeIncrement: isHypershiftSelected
      ? getNodeIncrementHypershift(machinePools?.length)
      : getNodeIncrement(isMultiAz),
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
      isHypershiftSelected,
    }),
    poolNumber: machinePools?.length,
  };
};

export default connect(mapStateToProps)(wizardConnector(MachinePoolScreen));
