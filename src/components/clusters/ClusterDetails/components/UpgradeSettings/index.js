import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import UpgradeSettingsTab from './UpgradeSettingsTab';
import {
  getSchedules, postSchedule, editSchedule, deleteSchedule, replaceSchedule,
  clearPostedUpgradeScheduleResponse, clearDeleteScheduleResponse,
} from '../../../common/Upgrades/clusterUpgradeActions';
import { editCluster, fetchClusterDetails } from '../../../../../redux/actions/clustersActions';
import { isHibernating } from '../../../common/clusterStates';
import { openModal } from '../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'ClusterUpgradeSettings',
  enableReinitialize: true,
};

const reduxFormUpgradeSettingsTab = reduxForm(reduxFormConfig)(UpgradeSettingsTab);
const valueSelector = formValueSelector('ClusterUpgradeSettings');

const mapStateToProps = (state) => {
  const automaticUpgradePolicy = state.clusterUpgrades.schedules.items.find(policy => policy.schedule_type === 'automatic');
  const { cluster } = state.clusters.details;
  return {
    cluster,
    clusterHibernating: isHibernating(cluster.state),
    isAutomatic: valueSelector(state, 'upgrade_policy') === 'automatic',
    schedules: state.clusterUpgrades.schedules,
    upgradeScheduleRequest: state.clusterUpgrades.postedUpgradeSchedule,
    deleteScheduleRequest: state.clusterUpgrades.deleteScheduleRequest,
    editClusterRequest: state.clusters.editedCluster,
    initialValues: {
      upgrade_policy: automaticUpgradePolicy ? 'automatic' : 'manual',
      automatic_upgrade_schedule: automaticUpgradePolicy?.schedule || '0 0 * * 0',
      node_drain_grace_period: cluster.node_drain_grace_period?.value,
      enable_user_workload_monitoring: !cluster.disable_user_workload_monitoring,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  clearResponses: () => {
    dispatch(clearPostedUpgradeScheduleResponse());
    dispatch(clearDeleteScheduleResponse());
  },
  openModal: (modal, data) => dispatch(openModal(modal, data)),
  getSchedules: clusterID => dispatch(getSchedules(clusterID)),
  getClusterDetails: clusterID => dispatch(fetchClusterDetails(clusterID)),
  onSubmit: (formData, clusterID, existingSchedules, existingGracePeriod,
    enableUserWorkloadMonitoring) => {
    const currentAutomaticUpgradePolicy = existingSchedules.items.find(policy => policy.schedule_type === 'automatic');
    const currentManualUpgradePolicy = existingSchedules.items.find(policy => policy.schedule_type === 'manual');

    if (formData.upgrade_policy === 'automatic') {
      if (currentAutomaticUpgradePolicy
          && currentAutomaticUpgradePolicy !== formData.automatic_upgrade_schedule) {
        // automatic policy needs an update
        dispatch(editSchedule(clusterID, currentAutomaticUpgradePolicy.id, {
          schedule: formData.automatic_upgrade_schedule,
        }));
      } else if (!currentAutomaticUpgradePolicy) {
        const newSchedule = {
          schedule_type: 'automatic',
          schedule: formData.automatic_upgrade_schedule,
        };
        if (currentManualUpgradePolicy) {
          // replace manual update schedule with the new automatic schedule
          dispatch(replaceSchedule(clusterID, currentManualUpgradePolicy.id, newSchedule));
        } else {
          // create a new automatic policy
          dispatch(postSchedule(clusterID, newSchedule));
        }
      }
    } else if (currentAutomaticUpgradePolicy) {
      // delete
      dispatch(deleteSchedule(clusterID, currentAutomaticUpgradePolicy.id));
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
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.cluster.id,
      stateProps.schedules,
      stateProps.cluster.node_drain_grace_period?.value,
      !stateProps.cluster.disable_user_workload_monitoring,
    );
  };
  return ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  });
};

export default connect(mapStateToProps,
  mapDispatchToProps, mergeProps)(reduxFormUpgradeSettingsTab);
