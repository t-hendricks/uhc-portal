import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import {
  getMinNodesRequired,
  getNodeIncrement,
  getMinNodesRequiredHypershift,
  getNodeIncrementHypershift,
} from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsHelper';
import { getWorkerNodeVolumeSizeMaxGiB } from '~/components/clusters/wizards/rosa/constants';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';

import wizardConnector from '../WizardConnector';
import MachinePoolScreen from './MachinePoolScreen';
import createOSDInitialValues from '../../createOSDInitialValues';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
  const machineType = valueSelector(state, 'machine_type');
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const selectedVPC = valueSelector(state, 'selected_vpc') ?? { id: '', name: '' };
  const clusterVersionRawId = valueSelector(state, 'cluster_version.raw_id');
  const imds = valueSelector(state, 'imds');
  const machinePools = valueSelector(state, 'machine_pools_subnets');
  const maxWorkerVolumeSizeGiB = getWorkerNodeVolumeSizeMaxGiB(clusterVersionRawId);

  return {
    cloudProviderID,
    isMultiAz,
    product,
    billingModel,
    isByoc,
    machineType,
    isHypershift: isHypershiftSelected,
    selectedVPC,
    imds,
    clusterVersionRawId,
    minNodesRequired: isHypershiftSelected
      ? getMinNodesRequiredHypershift(machinePools?.length)
      : getMinNodesRequired(true, isByoc, isMultiAz),
    nodeIncrement: isHypershiftSelected
      ? getNodeIncrementHypershift(machinePools?.length)
      : getNodeIncrement(isMultiAz),
    isHypershiftCluster: isHypershiftSelected,
    maxWorkerVolumeSizeGiB,
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

const mapDispatchToProps = (dispatch) => ({
  openEditClusterAutoScalingModal: () => dispatch(openModal(modals.EDIT_CLUSTER_AUTOSCALING_V1)),
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(MachinePoolScreen));
