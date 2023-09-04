import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  FormErrors,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  reduxForm,
} from 'redux-form';

import { GlobalState } from '~/redux/store';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import modals from '~/components/common/Modal/modals';

import {
  ClusterAutoScalingForm,
  getClusterAutoScalingSubmitSettings,
  getDefaultClusterAutoScaling,
} from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';
import { clusterAutoscalerActions } from '~/redux/actions/clusterAutoscalerActions';
import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';
import { closeModal } from '../../../common/Modal/ModalActions';
import EditClusterAutoScalingDialog, {
  EditClusterAutoScalingDialogProps,
} from './EditClusterAutoScalingDialog';

type Day2Props = {
  clusterId: string;
  clusterAutoscalerResponse: {
    getAutoscaler: {
      data?: ClusterAutoscaler;
    };
    hasAutoscaler: boolean;
    editAction: {
      pending: boolean;
      fulfilled: boolean;
      error: boolean;
      errorMessage?: string;
    };
  };
};

type ScalingFormData = {
  cluster_autoscaling: ClusterAutoScalingForm; // eslint-disable-line camelcase
};

const DAY1_SELECTOR = 'CreateCluster';
const DAY2_SELECTOR = 'EditClusterAutoScaler';

const EditClusterAutoScalerDay2Form = reduxForm<ScalingFormData, EditClusterAutoScalingDialogProps>(
  {
    form: DAY2_SELECTOR,
    enableReinitialize: true,
  },
)(EditClusterAutoScalingDialog);

const day1FormValueSelectorMapper = (state: GlobalState): EditClusterAutoScalingDialogProps => {
  const formErrors = getFormSyncErrors(DAY1_SELECTOR)(state) as FormErrors<ScalingFormData>;
  const valueSelector = formValueSelector(DAY1_SELECTOR) || {};

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_AUTOSCALING_V1),
    autoScalingValues: valueSelector(state, 'cluster_autoscaling'),
    autoScalingErrors: formErrors.cluster_autoscaling || {},
  } as EditClusterAutoScalingDialogProps;
};

const day2FormValueSelectorMapper = (
  state: GlobalState,
  ownProps: Day2Props,
): EditClusterAutoScalingDialogProps => {
  const formErrors = getFormSyncErrors(DAY2_SELECTOR)(state) as FormErrors<ScalingFormData>;

  const baseData =
    ownProps.clusterAutoscalerResponse.getAutoscaler.data || getDefaultClusterAutoScaling();

  const currentAutoscaler = {
    ...baseData,
    isSelected: ownProps.clusterAutoscalerResponse.hasAutoscaler,
  };

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_AUTOSCALING_V1),
    autoScalingValues: currentAutoscaler,
    autoScalingErrors: formErrors.cluster_autoscaling || {},
    initialValues: { cluster_autoscaling: currentAutoscaler },
    editAction: ownProps.clusterAutoscalerResponse.editAction,
  } as unknown as EditClusterAutoScalingDialogProps;
};

type Day2ScalerAction = 'update' | 'enable' | 'disable';

const mapDispatchDay2ToProps = (dispatch: Dispatch, ownProps: Day2Props) => ({
  onSubmitAutoScaling: (action: Day2ScalerAction) =>
    // @ts-ignore
    dispatch((_, getState) => {
      const formData = getFormValues('EditClusterAutoScaler')(getState()) as ScalingFormData;
      const autoscaler = formData.cluster_autoscaling;
      const { clusterId } = ownProps;
      switch (action) {
        case 'enable': {
          dispatch(clusterAutoscalerActions.enableClusterAutoscaler(clusterId));
          break;
        }
        case 'disable': {
          dispatch(clusterAutoscalerActions.disableClusterAutoscaler(clusterId));
          break;
        }
        case 'update':
        default:
          {
            const submitValues = getClusterAutoScalingSubmitSettings(autoscaler);
            dispatch(clusterAutoscalerActions.updateClusterAutoscaler(clusterId, submitValues));
          }
          break;
      }
    }),
  closeModal: () => {
    dispatch(clusterAutoscalerActions.clearLastAutoscalerActionResult());
    dispatch(closeModal());
  },
});

const mapDispatchDay1ToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal()),
});

export const EditClusterAutoScalerForDay2 = connect(
  day2FormValueSelectorMapper,
  mapDispatchDay2ToProps,
)(EditClusterAutoScalerDay2Form);

export default connect(
  day1FormValueSelectorMapper,
  mapDispatchDay1ToProps,
)(EditClusterAutoScalingDialog);
