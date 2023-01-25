import React, { Component } from 'react';

import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import PropTypes from 'prop-types';
import { Form, Alert } from '@patternfly/react-core';
import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';

class HibernateClusterModal extends Component {
  componentDidMount() {
    const { getSchedules, clusterID, clusterUpgrades } = this.props;
    if (clusterID && !clusterUpgrades.pending) {
      getSchedules(clusterID);
    }
  }

  componentDidUpdate() {
    const { hibernateClusterResponse, resetResponses, closeModal, onClose } = this.props;
    if (hibernateClusterResponse.fulfilled) {
      resetResponses();
      closeModal();
      onClose();
    }
  }

  render() {
    const {
      closeModal,
      submit,
      hibernateClusterResponse,
      resetResponses,
      clusterID,
      clusterName,
      clusterUpgrades,
      history,
      subscriptionID,
      shouldDisplayClusterName,
    } = this.props;

    const upgradesInState = (state) =>
      clusterUpgrades.items.filter((schedule) => schedule.state?.value === state);

    const cancelHibernateCluster = () => {
      resetResponses();
      closeModal();
    };

    const error = hibernateClusterResponse.error ? (
      <ErrorBox message="Error hibernating cluster" response={hibernateClusterResponse} />
    ) : null;

    const handleSubmit = () => {
      submit(clusterID);
    };

    const defaultForm = (
      <Form onSubmit={() => submit()}>
        {error}
        <p>
          Moving <b>{clusterName}</b> cluster to Hibernating state will block any operation for this
          cluster. While hibernating, the cluster will not consume any virtual machine instance or
          network resources, but will still count against subscription quota. Note that version
          upgrades will not occur.
        </p>
        <Alert
          variant="warning"
          title={`
            In case the cluster’s cloud provider is not responsive,
            resuming from hibernation might not be completed and will require manual intervention for the cluster to be restored.   
          `}
        />
        This can be undone at any time.
      </Form>
    );

    const upgradeScheduledForm = (schedule) => (
      <Form onSubmit={() => submit()}>
        {error}
        <p>
          Moving <b>{clusterName}</b> cluster to Hibernating state is not possible while there is a
          scheduled cluster upgrade.
        </p>
        <Alert
          variant="warning"
          title={
            <p>
              There is a scheduled update to,{' '}
              <DateFormat type="exact" date={Date.parse(schedule.next_run)} />. The scheduled update
              cannot be executed if the cluster is hibernating
            </p>
          }
        />
        Try again after the cluster upgrade is done or cancel the upgrade.
      </Form>
    );

    const upgradeInProgressForm = (
      <Form onSubmit={() => submit()}>
        {error}
        <p>
          Moving <b>{clusterName}</b> to Hibernating state is not possible while the cluster is
          upgrading.
        </p>
      </Form>
    );

    let hibernateForm;
    let primaryText;
    let secondaryText;
    let onPrimaryClick;
    let onSecondaryClick;
    const scheduledUpgrades = upgradesInState('scheduled');
    const upgradesInProgress = upgradesInState('started');
    if (upgradesInProgress.length > 0) {
      primaryText = 'Cancel';
      onPrimaryClick = cancelHibernateCluster;
      secondaryText = 'See version update details';
      hibernateForm = upgradeInProgressForm;
    } else if (scheduledUpgrades.length > 0) {
      primaryText = 'Cancel';
      secondaryText = 'Change cluster upgrade policy';
      onSecondaryClick = () => {
        cancelHibernateCluster();
        if (history.location.pathname.startsWith('/details/s/')) {
          window.location.hash = '#updateSettings';
        } else {
          history.push({
            pathname: `/details/s/${subscriptionID}`,
            hash: '#updateSettings',
          });
        }
      };
      onPrimaryClick = cancelHibernateCluster;
      hibernateForm = upgradeScheduledForm(scheduledUpgrades[0]);
    } else {
      hibernateForm = defaultForm;
      primaryText = 'Hibernate cluster';
      secondaryText = 'Cancel';
      onPrimaryClick = handleSubmit;
      onSecondaryClick = cancelHibernateCluster;
    }

    return (
      <Modal
        data-testid="hibernate-cluster-modal"
        title="Hibernate cluster"
        secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
        onClose={cancelHibernateCluster}
        primaryText={primaryText}
        secondaryText={secondaryText}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
        isPending={hibernateClusterResponse.pending || clusterUpgrades.pending}
      >
        <>{hibernateForm}</>
      </Modal>
    );
  }
}

HibernateClusterModal.propTypes = {
  clusterID: PropTypes.string.isRequired,
  subscriptionID: PropTypes.string.isRequired,
  clusterName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  resetResponses: PropTypes.func.isRequired,
  getSchedules: PropTypes.func.isRequired,
  clusterUpgrades: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    items: PropTypes.array,
  }).isRequired,
  hibernateClusterResponse: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
  }),
  submit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  }).isRequired,
  shouldDisplayClusterName: PropTypes.bool,
};

HibernateClusterModal.defaultProps = {
  hibernateClusterResponse: {},
};

HibernateClusterModal.modalName = modals.HIBERNATE_CLUSTER;

export default HibernateClusterModal;
