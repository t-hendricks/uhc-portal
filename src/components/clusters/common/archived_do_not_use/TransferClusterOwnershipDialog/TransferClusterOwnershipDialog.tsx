import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';

import getClusterName from '~/common/getClusterName';
import { ocmBaseName } from '~/common/routing';
import {
  clearToggleSubscriptionReleasedResponse,
  toggleSubscriptionReleased,
} from '~/redux/actions/subscriptionReleasedActions';
import { useGlobalState } from '~/redux/hooks';
import { Subscription, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import ErrorBox from '../../../../common/ErrorBox';
import ExternalLink from '../../../../common/ExternalLink';
import Modal from '../../../../common/Modal/Modal';
import { closeModal } from '../../../../common/Modal/ModalActions';
import modals from '../../../../common/Modal/modals';

const CHANGE_PULL_SECRET_URL = 'https://access.redhat.com/solutions/4902871';

type TransferClusterOwnershipDialogProps = {
  onClose: () => void;
};

type ModaData = {
  subscription: Subscription;
  shouldDisplayClusterName?: boolean;
};

const TransferClusterOwnershipDialog = ({ onClose }: TransferClusterOwnershipDialogProps) => {
  const dispatch = useDispatch();

  const modalData: ModaData = useGlobalState((state) => state.modal.data) as ModaData;
  const requestState = useGlobalState((state) => state.subscriptionReleased.requestState);

  const clusterDisplayName = useMemo(() => {
    const fakeCluster: ClusterFromSubscription = {
      subscription: modalData.subscription,
    } as ClusterFromSubscription;

    return getClusterName(fakeCluster);
  }, [modalData]);
  const subscription = useMemo(() => modalData.subscription, [modalData]);
  const shouldDisplayClusterName = useMemo(
    () => modalData.shouldDisplayClusterName ?? false,
    [modalData],
  );

  const handleSubmit = () => {
    if (subscription?.id) {
      const isReleased = subscription?.released ?? false;
      dispatch(toggleSubscriptionReleased(subscription.id, !isReleased));
    }
  };

  const handleClose = useCallback(() => {
    dispatch(clearToggleSubscriptionReleasedResponse());
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    if (requestState.fulfilled) {
      handleClose();
      onClose();
    }
  }, [handleClose, onClose, requestState.fulfilled]);

  return (
    <Modal
      title="Transfer cluster ownership"
      secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
      width={600}
      variant="large"
      onClose={handleClose}
      primaryText="Initiate transfer"
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={handleClose}
      isPrimaryDisabled={requestState.pending}
    >
      {requestState.error ? (
        <ErrorBox message="Error initiating transfer" response={requestState} />
      ) : null}
      <TextContent>
        <Text component={TextVariants.p}>
          Transferring cluster ownership will allow another individual to manage this cluster. The
          steps for transferring cluster ownership are:
        </Text>
        {subscription?.status === SubscriptionCommonFields.status.DISCONNECTED ? (
          <TextList component={TextListVariants.ol}>
            <TextListItem>Initiate transfer</TextListItem>
            <TextListItem>
              <ExternalLink href={`${ocmBaseName}/register`}>Register the cluster</ExternalLink>{' '}
              within 5 days
            </TextListItem>
          </TextList>
        ) : (
          <>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Initiate transfer</TextListItem>
              <TextListItem>
                <ExternalLink href={CHANGE_PULL_SECRET_URL}>
                  Change the cluster&apos;s pull secret
                </ExternalLink>{' '}
                within 5 days
              </TextListItem>
            </TextList>
            <Text component={TextVariants.p}>
              The transfer is complete when OpenShift Cluster Manager receives telemetry data from
              the cluster with the new pull secret.
            </Text>
          </>
        )}
        <Text component={TextVariants.h4}>
          If the transfer is not completed within 5 days, the procedure must be restarted.
        </Text>
      </TextContent>
    </Modal>
  );
};

TransferClusterOwnershipDialog.modalName = modals.TRANSFER_CLUSTER_OWNERSHIP;

export default TransferClusterOwnershipDialog;
