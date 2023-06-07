import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import UpgradeSettingsTab from './UpgradeSettingsTab';
import {
  getSchedules,
  postSchedule,
  editSchedule,
  deleteSchedule,
  replaceSchedule,
  clearPostedUpgradeScheduleResponse,
  clearDeleteScheduleResponse,
} from '../../../common/Upgrades/clusterUpgradeActions';
import { editCluster, fetchClusterDetails } from '../../../../../redux/actions/clustersActions';
import { isHibernating } from '../../../common/clusterStates';
import { openModal } from '../../../../common/Modal/ModalActions';
import { knownProducts } from '~/common/subscriptionTypes';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

const reduxFormConfig = {
  form: 'ClusterUpgradeSettings',
  // This form serves for both display of current state and editing.
  // For display, reset the form upon changes in initialValues.
  enableReinitialize: true,
  // TODO: do we want keepDirtyOnReinitialize: true ?
};

const reduxFormUpgradeSettingsTab = reduxForm(reduxFormConfig)(UpgradeSettingsTab);
const valueSelector = formValueSelector('ClusterUpgradeSettings');

const mapStateToProps = (state) => {
  const automaticUpgradePolicy = state.clusterUpgrades.schedules.items.find(
    (policy) => policy.schedule_type === 'automatic',
  );
  const { cluster } = state.clusters.details;
  const isAROCluster = get(cluster, 'subscription.plan.type', '') === knownProducts.ARO;
  return {
    cluster,
    isAROCluster,
    clusterHibernating: isHibernating(cluster.state),
    isReadOnly: cluster?.status?.configuration_mode === 'read_only',
    isAutomatic: valueSelector(state, 'upgrade_policy') === 'automatic',
    schedules: state.clusterUpgrades.schedules,
    upgradeScheduleRequest: state.clusterUpgrades.postedUpgradeSchedule,
    deleteScheduleRequest: state.clusterUpgrades.deleteScheduleRequest,
    editClusterRequest: state.clusters.editedCluster,
    isHypershift: isHypershiftCluster(cluster),
    initialValues: {
      upgrade_policy: automaticUpgradePolicy ? 'automatic' : 'manual',
      automatic_upgrade_schedule: automaticUpgradePolicy?.schedule || '0 0 * * 0',
      node_drain_grace_period: cluster.node_drain_grace_period?.value,
      enable_user_workload_monitoring: !cluster.disable_user_workload_monitoring,
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearResponses: () => {
    dispatch(clearPostedUpgradeScheduleResponse());
    dispatch(clearDeleteScheduleResponse());
  },
  openModal: (modal, data) => dispatch(openModal(modal, data)),
  getSchedules: (clusterID, isHypershift) => dispatch(getSchedules(clusterID, isHypershift)),
  getClusterDetails: (clusterID) => dispatch(fetchClusterDetails(clusterID)),
  onSubmit: (
    formData,
    clusterID,
    existingSchedules,
    existingGracePeriod,
    enableUserWorkloadMonitoring,
    isHypershift,
  ) => {
    const currentAutomaticUpgradePolicy = existingSchedules.items.find(
      (policy) => policy.schedule_type === 'automatic',
    );
    const currentManualUpgradePolicy = existingSchedules.items.find(
      (policy) => policy.schedule_type === 'manual',
    );

    if (formData.upgrade_policy === 'automatic') {
      if (
        currentAutomaticUpgradePolicy &&
        currentAutomaticUpgradePolicy !== formData.automatic_upgrade_schedule
      ) {
        // automatic policy needs an update
        dispatch(
          editSchedule(
            clusterID,
            currentAutomaticUpgradePolicy.id,
            {
              schedule: formData.automatic_upgrade_schedule,
            },
            isHypershift,
          ),
        );
      } else if (!currentAutomaticUpgradePolicy) {
        const newSchedule = {
          schedule_type: 'automatic',
          schedule: formData.automatic_upgrade_schedule,
        };
        if (currentManualUpgradePolicy) {
          // replace manual update schedule with the new automatic schedule
          dispatch(
            replaceSchedule(clusterID, currentManualUpgradePolicy.id, newSchedule, isHypershift),
          );
        } else {
          // create a new automatic policy
          dispatch(postSchedule(clusterID, newSchedule, isHypershift));
        }
      }
    } else if (currentAutomaticUpgradePolicy) {
      // delete
      dispatch(deleteSchedule(clusterID, currentAutomaticUpgradePolicy.id, isHypershift));
    }
    const clusterBody = {};
    if (existingGracePeriod !== formData.node_drain_grace_period) {
      // update grace period on the cluster
      clusterBody.node_drain_grace_period = {
        value: formData.node_drain_grace_period,
      };
    }
    if (enableUserWorkloadMonitoring !== formData.enable_user_workload_monitoring) {
      clusterBody.disable_user_workload_monitoring = !formData.enable_user_workload_monitoring;
    }
    if (!isEmpty(clusterBody)) {
      dispatch(editCluster(clusterID, clusterBody));
    }
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const getSchedules = (clusterID, isHypershift) => {
    dispatchProps.getSchedules(clusterID, isHypershift);
  };
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.cluster.id,
      stateProps.schedules,
      stateProps.cluster.node_drain_grace_period?.value,
      !stateProps.cluster.disable_user_workload_monitoring,
      stateProps.isHypershift,
    );
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    getSchedules,
    onSubmit,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(reduxFormUpgradeSettingsTab);
