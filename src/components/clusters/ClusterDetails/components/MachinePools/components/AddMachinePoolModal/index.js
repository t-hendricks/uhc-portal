import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import AddMachinePoolModal from './AddMachinePoolModal';
import { canAutoScaleSelector, canUseSpotInstances } from '../../MachinePoolsSelectors';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { addMachinePoolOrNodePool, clearAddMachinePoolResponse } from '../../MachinePoolsActions';
import { isMultiAZ } from '../../../../clusterDetailsHelper';

import {
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
} from '../../../../../../../common/helpers';

const reduxFormConfig = {
  form: 'AddMachinePool',
  touchOnChange: true,
};
const reduxFormAddMachinePool = reduxForm(reduxFormConfig)(AddMachinePoolModal);

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('AddMachinePool');

  return {
    addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
    selectedMachineType: valueSelector(state, 'machine_type'),
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    canAutoScale: canAutoScaleSelector(state, ownProps.cluster.subscription.plan.type),
    canUseSpotInstances: canUseSpotInstances(state, ownProps.cluster.subscription.plan.type),
    useSpotInstances: valueSelector(state, 'spot_instances'),
    spotInstancePricing: valueSelector(state, 'spot_instance_pricing'),
    spotInstanceMaxHourlyPrice: valueSelector(state, 'spot_instance_max_hourly_price') || 0.01,
    initialValues: {
      name: '',
      subnet: '',
      nodes_compute: '0',
      node_labels: [{}],
      taints: [{ effect: 'NoSchedule' }],
    },
    vpcListPending: state.ccsInquiries?.vpcs?.pending,
    vpcListBySubnet: state.ccsInquiries?.vpcs?.data?.bySubnetID,
  };
};

// MachinePoolAutoscaling uses min_replicas and max_replicas, NodePoolAutoscaling uses min_replica and max_replica
const replicasFieldName = ({ isHypershiftCluster }, minOrMax) =>
  `${minOrMax}_replica${!isHypershiftCluster ? 's' : ''}`;

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const { isHypershiftCluster } = ownProps;
    const machinePoolRequest = {
      id: formData.name,
    };

    if (formData.autoscalingEnabled) {
      const minNodes = parseInt(formData.min_replicas, 10);
      const maxNodes = parseInt(formData.max_replicas, 10);
      // const isMultiAz = !isHypershiftCluster && ownProps.cluster.multi_az;

      const isMultiAvailZone = isMultiAZ(ownProps.cluster);

      machinePoolRequest.autoscaling = {
        [replicasFieldName(ownProps, 'min')]: isMultiAvailZone ? minNodes * 3 : minNodes,
        [replicasFieldName(ownProps, 'max')]: isMultiAvailZone ? maxNodes * 3 : maxNodes,
      };
    } else {
      machinePoolRequest.replicas = parseInt(formData.nodes_compute, 10);
    }

    if (isHypershiftCluster) {
      machinePoolRequest.aws_node_pool = {
        instance_type: formData.machine_type,
      };
      machinePoolRequest.subnet = formData.subnet.id;
    } else {
      machinePoolRequest.instance_type = formData.machine_type;
      if (formData.spot_instances) {
        machinePoolRequest.aws = {
          spot_market_options:
            formData.spot_instance_pricing === 'maximum' &&
            formData.spot_instance_max_hourly_price !== undefined
              ? { max_price: formData.spot_instance_max_hourly_price }
              : {},
        };
      }
    }
    const parsedLabels = parseReduxFormKeyValueList(formData.node_labels);
    const parsedTaints = parseReduxFormTaints(formData.taints);

    if (!isEmpty(parsedLabels)) {
      machinePoolRequest.labels = parsedLabels;
    }

    if (parsedTaints.length > 0) {
      machinePoolRequest.taints = parsedTaints;
    }

    dispatch(
      addMachinePoolOrNodePool(
        ownProps.cluster.id,
        machinePoolRequest,
        ownProps.isHypershiftCluster,
      ),
    );
  },
  clearAddMachinePoolResponse: () => dispatch(clearAddMachinePoolResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddMachinePool);
