import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Modal,
  Alert,
} from '@patternfly/react-core';
import UpgradeStatus from '../../../common/Upgrades/UpgradeStatus';
import getClusterName from '../../../../../common/getClusterName';
import UpgradeSettingsFields from '../../../common/Upgrades/UpgradeSettingsFields';
import ErrorBox from '../../../../common/ErrorBox';
import modals from '../../../../common/Modal/modals';
import UserWorkloadMonitoringSection from '../../../common/UserWorkloadMonitoringSection';
import '../../../common/Upgrades/UpgradeSettingsFields.scss';
import clusterStates from '../../../common/clusterStates';
import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import MinorVersionUpgradeAlert from '../../../common/Upgrades/MinorVersionUpgradeAlert';
import UpgradeAcknowledgeWarning from '../../../common/Upgrades/UpgradeAcknowledge/UpgradeAcknowledgeWarning';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

class UpgradeSettingsTab extends React.Component {
  state = { confirmationModalOpen: false };

  componentDidMount() {
    const { getSchedules, cluster, upgradeScheduleRequest } = this.props;
    if (cluster.id && !upgradeScheduleRequest.pending) {
      getSchedules(cluster.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { isAutomatic, schedules, pristine, getClusterDetails, editClusterRequest, cluster } =
      this.props;
    const scheduledManualUpgrade = schedules.items.find(
      (schedule) => schedule.schedule_type === 'manual' && schedule.upgrade_type === 'OSD',
    );
    if (!prevProps.isAutomatic && isAutomatic && !pristine && scheduledManualUpgrade) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ confirmationModalOpen: true });
    }
    if (prevProps.editClusterRequest.pending && editClusterRequest.fulfilled) {
      getClusterDetails(cluster.subscription.id);
    }
  }

  componentWillUnmount() {
    const { clearResponses } = this.props;
    clearResponses();
  }

  closeConfirmationModal = () => {
    this.setState({ confirmationModalOpen: false });
  };

  closeConfirmationModalAndReset = () => {
    const { reset } = this.props;
    this.closeConfirmationModal();
    reset();
  };

  render() {
    const {
      isAutomatic,
      handleSubmit,
      pristine,
      schedules,
      upgradeScheduleRequest,
      deleteScheduleRequest,
      editClusterRequest,
      reset,
      cluster,
      openModal,
      change,
      initialValues,
      clusterHibernating,
      isReadOnly,
      isAROCluster,
    } = this.props;
    const { confirmationModalOpen } = this.state;

    const isDisabled = !schedules.fulfilled || upgradeScheduleRequest.pending;
    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason =
      clusterHibernating && 'This operation is not available while cluster is hibernating';
    // a superset of hibernatingReason.
    const notReadyReason = cluster.state !== clusterStates.READY && 'This cluster is not ready';
    const pristineReason = pristine && 'No changes to save';
    const formDisableReason = readOnlyReason || hibernatingReason;

    const scheduledManualUpgrade = schedules.items.find(
      (schedule) => schedule.schedule_type === 'manual' && schedule.upgrade_type === 'OSD',
    );

    const scheduledUpgrade = schedules.items.find(
      (schedule) =>
        ['manual', 'automatic'].includes(schedule.schedule_type) && schedule.upgrade_type === 'OSD',
    );
    // eslint-disable-next-line camelcase
    const availableUpgrades = cluster?.version?.available_upgrades;

    const showUpdateButton =
      !!cluster.openshift_version &&
      availableUpgrades?.length > 0 &&
      !scheduledUpgrade &&
      !clusterHibernating;

    const isPending =
      upgradeScheduleRequest.pending || deleteScheduleRequest.pending || editClusterRequest.pending;

    const saveButton = (
      <ButtonWithTooltip
        disableReason={formDisableReason || pristineReason}
        isAriaDisabled={isDisabled}
        variant="primary"
        onClick={handleSubmit}
        isLoading={isPending}
      >
        Save
      </ButtonWithTooltip>
    );
    const resetButton = (
      <ButtonWithTooltip isDisabled={pristine} variant="link" onClick={reset}>
        Cancel
      </ButtonWithTooltip>
    );

    const disableUVM = !!(readOnlyReason || hibernatingReason || notReadyReason);

    const hibernatingClusterInfo = (
      <Alert
        variant="info"
        className="pf-u-mb-md"
        isInline
        title="Version updates will not occur while this cluster is Hibernating.
            Once resumed, updates will start according to the selected updates strategy."
      />
    );

    return (
      <Grid hasGutter className="ocm-c-upgrade-monitoring">
        <GridItem>
          {editClusterRequest.error && (
            <ErrorBox response={editClusterRequest} message="Error processing request" />
          )}
          {!isAROCluster && (
            <Card>
              <CardBody>
                <UserWorkloadMonitoringSection
                  parent="details"
                  disableUVM={disableUVM}
                  planType={cluster.subscription?.plan?.type}
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
        <GridItem lg={9} md={12} className="ocm-c-upgrade-monitoring-top">
          <Card>
            <CardTitle>Update strategy</CardTitle>
            <CardBody>
              {scheduledManualUpgrade && confirmationModalOpen && (
                <Modal
                  variant="small"
                  title="Recurring updates"
                  isOpen
                  onClose={() => {
                    this.closeConfirmationModal();
                    reset();
                  }}
                  actions={[
                    <Button key="confirm" variant="primary" onClick={this.closeConfirmationModal}>
                      Yes, cancel scheduled update
                    </Button>,
                    <Button
                      key="cancel"
                      variant="secondary"
                      onClick={() => {
                        this.closeConfirmationModal();
                        reset();
                      }}
                    >
                      No, keep scheduled update
                    </Button>,
                  ]}
                >
                  By choosing recurring updates, any individually scheduled update will be{' '}
                  cancelled. Are you sure you want to continue?
                </Modal>
              )}
              {clusterHibernating && hibernatingClusterInfo}
              {upgradeScheduleRequest.error && (
                <ErrorBox response={upgradeScheduleRequest} message="Can't schedule upgrade" />
              )}
              {deleteScheduleRequest.error && (
                <ErrorBox response={deleteScheduleRequest} message="Can't unschedule upgrade" />
              )}

              <UpgradeAcknowledgeWarning />
              <MinorVersionUpgradeAlert />

              <Form>
                <Grid hasGutter>
                  <UpgradeSettingsFields
                    isAutomatic={isAutomatic}
                    isDisabled={!!formDisableReason}
                    change={change}
                    initialSceduleValue={initialValues.automatic_upgrade_schedule}
                    showDivider
                    isHypershift={isHypershiftCluster(cluster)}
                  />
                </Grid>
              </Form>
            </CardBody>
            <CardFooter>
              <Flex>
                <FlexItem>{saveButton}</FlexItem>
                <FlexItem>{resetButton}</FlexItem>
              </Flex>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem lg={3} md={12} className="ocm-c-upgrade-monitoring-top">
          <Card>
            <CardTitle>Update status</CardTitle>
            <CardBody>
              <UpgradeStatus
                clusterID={cluster.id}
                canEdit={cluster.canEdit}
                clusterVersion={cluster.openshift_version}
                clusterVersionRawID={cluster?.version?.raw_id}
                scheduledUpgrade={scheduledUpgrade}
                availableUpgrades={availableUpgrades}
                openModal={openModal}
              />
              {showUpdateButton && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    openModal(modals.UPGRADE_WIZARD, {
                      clusterName: getClusterName(cluster),
                      subscriptionID: cluster.subscription.id,
                    })
                  }
                >
                  Update
                </Button>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

UpgradeSettingsTab.propTypes = {
  pristine: PropTypes.bool,
  isAutomatic: PropTypes.bool,
  isAROCluster: PropTypes.bool,
  clusterHibernating: PropTypes.bool,
  isReadOnly: PropTypes.bool.isRequired,
  cluster: PropTypes.shape({
    canEdit: PropTypes.bool,
    openshift_version: PropTypes.string,
    id: PropTypes.string,
    subscription: PropTypes.shape({
      id: PropTypes.string,
      plan: PropTypes.shape({ type: PropTypes.string }),
    }),
    version: PropTypes.shape({
      channel_group: PropTypes.string,
      available_upgrades: PropTypes.arrayOf(PropTypes.string),
      raw_id: PropTypes.string,
    }),
    state: PropTypes.string,
  }),
  getSchedules: PropTypes.func.isRequired,
  getClusterDetails: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  schedules: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    items: PropTypes.array,
  }),
  upgradeScheduleRequest: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
  }),
  deleteScheduleRequest: PropTypes.shape({
    pending: PropTypes.bool,
    error: PropTypes.bool,
  }),
  editClusterRequest: PropTypes.shape({
    pending: PropTypes.bool,
    error: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }),
  reset: PropTypes.func,
  openModal: PropTypes.func,
  clearResponses: PropTypes.func,
  change: PropTypes.func,
  initialValues: PropTypes.shape({
    automatic_upgrade_schedule: PropTypes.string,
  }),
};

export default UpgradeSettingsTab;
