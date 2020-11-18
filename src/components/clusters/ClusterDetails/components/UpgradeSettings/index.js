
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import UpgradeSettingsTab from './UpgradeSettingsTab';
import {
  getSchedules, postSchedule, editSchedule, deleteSchedule, replaceSchedule,
} from '../../../common/Upgrades/clusterUpgradeActions';
import { openModal } from '../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'ClusterUpgradeSettings',
  enableReinitialize: true,
};

const reduxFormUpgradeSettingsTab = reduxForm(reduxFormConfig)(UpgradeSettingsTab);
const valueSelector = formValueSelector('ClusterUpgradeSettings');


const mapStateToProps = (state) => {
  const automaticUpgradePolicy = state.clusterUpgrades.schedules.items.find(policy => policy.schedule_type === 'automatic');
  return {
    cluster: state.clusters.details.cluster,
    versionInfo: state.clusterUpgrades.versionInfo,
    isAutomatic: valueSelector(state, 'upgrade_policy') === 'automatic',
    schedules: state.clusterUpgrades.schedules,
    upgradeScheduleRequest: state.clusterUpgrades.postedUpgradeSchedule,
    initialValues: {
      upgrade_policy: automaticUpgradePolicy ? 'automatic' : 'manual',
      automatic_upgrade_schedule: automaticUpgradePolicy?.schedule || '0 0 * * 0',
    },
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: (modal, data) => dispatch(openModal(modal, data)),
  getSchedules: clusterID => dispatch(getSchedules(clusterID)),
  onSubmit: (formData, clusterID, existingSchedules) => {
    const currentAutomaticUpgradePolicy = existingSchedules.items.find(policy => policy.schedule_type === 'automatic');
    const currentManualUpgradePolicy = existingSchedules.items.find(policy => policy.schedule_type === 'manual');
    if (formData.upgrade_policy === 'automatic') {
      if (currentAutomaticUpgradePolicy) {
        dispatch(editSchedule(clusterID, currentAutomaticUpgradePolicy.id, {
          schedule: formData.automatic_upgrade_schedule,
        }));
      } else {
        const newSchedule = {
          schedule_type: 'automatic',
          schedule: formData.automatic_upgrade_schedule,
        };
        if (currentManualUpgradePolicy) {
          // replace manual update schedule with the new automatic schedule
          dispatch(replaceSchedule(clusterID, currentManualUpgradePolicy.id, newSchedule));
        } else {
          dispatch(postSchedule(clusterID, newSchedule));
        }
      }
    } else if (currentAutomaticUpgradePolicy) {
      // delete
      dispatch(deleteSchedule(clusterID, currentAutomaticUpgradePolicy.id));
    }
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.cluster.id,
      stateProps.schedules,
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
