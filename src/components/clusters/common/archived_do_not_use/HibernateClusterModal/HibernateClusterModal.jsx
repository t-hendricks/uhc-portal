import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@patternfly/react-core';

import { ocmBaseName } from '~/common/routing';

import ErrorBox from '../../../../common/ErrorBox';
import Modal from '../../../../common/Modal/Modal';
import modals from '../../../../common/Modal/modals';

import HibernateClusterContent from './HibernateClusterContent';
import HibernateClusterModalTitle from './HibernateClusterModalTitle';
import HibernateClusterUpgradeInProgress from './HibernateClusterUpgradeInProgress';
import HibernateClusterUpgradeScheduled from './HibernateClusterUpgradeScheduled';

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

    const scheduledUpgrades = upgradesInState('scheduled');
    const upgradesInProgress = upgradesInState('started');

    let hibernateFormContent;
    let secondaryText = 'Close';
    let isHibernateEnabled;

    if (upgradesInProgress.length > 0) {
      isHibernateEnabled = false;
      secondaryText = 'See version update details';
      hibernateFormContent = <HibernateClusterUpgradeInProgress clusterName={clusterName} />;
    } else if (scheduledUpgrades.length > 0) {
      isHibernateEnabled = false;
      secondaryText = 'Change cluster upgrade policy';
      hibernateFormContent = (
        <HibernateClusterUpgradeScheduled
          clusterName={clusterName}
          nextRun={scheduledUpgrades[0].next_run}
        />
      );
    } else {
      isHibernateEnabled = true;
      hibernateFormContent = (
        <HibernateClusterContent clusterName={clusterName} isHibernating={false} />
      );
    }

    const onPrimaryClick = () => {
      if (isHibernateEnabled) {
        submit(clusterID);
      } else {
        cancelHibernateCluster();
      }
    };
    const onSecondaryClick = ({ location, navigate }) => {
      cancelHibernateCluster();
      if (!isHibernateEnabled) {
        if (location.pathname.startsWith(`${ocmBaseName}/details/s/`)) {
          navigate({
            hash: '#updateSettings',
          });
        } else {
          navigate({
            pathname: `/details/s/${subscriptionID}`,
            hash: '#updateSettings',
          });
        }
      }
    };

    return (
      <Modal
        aria-label="hibernate-cluster-modal"
        header={<HibernateClusterModalTitle title="Hibernate cluster" />}
        titleIconVariant="danger"
        secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
        primaryText={isHibernateEnabled ? 'Hibernate cluster' : 'Close'}
        onPrimaryClick={onPrimaryClick}
        secondaryText={secondaryText}
        onSecondaryClick={onSecondaryClick}
        onClose={cancelHibernateCluster}
        isPending={hibernateClusterResponse.pending || clusterUpgrades.pending}
      >
        <Form onSubmit={submit}>
          {error}
          {hibernateFormContent}
        </Form>
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
  shouldDisplayClusterName: PropTypes.bool,
};

HibernateClusterModal.defaultProps = {
  hibernateClusterResponse: {},
};

HibernateClusterModal.modalName = modals.HIBERNATE_CLUSTER;

export default HibernateClusterModal;
