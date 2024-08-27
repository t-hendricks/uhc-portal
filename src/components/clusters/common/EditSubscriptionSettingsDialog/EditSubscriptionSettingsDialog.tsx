import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Form, Text, TextContent, TextVariants } from '@patternfly/react-core';

import getClusterName from '~/common/getClusterName';
import {
  clearEditSubscriptionSettingsResponse,
  editSubscriptionSettings,
} from '~/redux/actions/subscriptionSettingsActions';
import { useGlobalState } from '~/redux/hooks';
import { SubscriptionPatchRequest } from '~/types/accounts_mgmt.v1';
import { ErrorState } from '~/types/types';

import {
  hasCapability,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';
import Modal from '../../../common/Modal/Modal';
import { closeModal } from '../../../common/Modal/ModalActions';
import modals from '../../../common/Modal/modals';

import EditSubscriptionSettingsFields from './EditSubscriptionSettingsFields';
import EditSubscriptionSettingsRequestState from './EditSubscriptionSettingsRequestState';

type EditSubscriptionSettingsDialogProps = {
  onClose: () => void;
};

const EditSubscriptionSettingsDialog = ({ onClose }: EditSubscriptionSettingsDialogProps) => {
  const dispatch = useDispatch();

  const subscription = useGlobalState((state) => (state?.modal?.data as any)?.subscription ?? {});

  const [settings, setSettings] = useState<{ [index: string]: any }>({
    ...subscription,
    isValid: true,
  });

  const shouldDisplayClusterName = useGlobalState(
    (state) => (state?.modal?.data as any)?.shouldDisplayClusterName,
  );
  const clusterDisplayName = useGlobalState((state) => getClusterName(state?.modal?.data as any));
  const requestState = useGlobalState((state) => state.subscriptionSettings.requestState);

  const submit = (subscriptionID: string, updates: { [index: string]: any }) => {
    const requestData = { ...updates } as SubscriptionPatchRequest;
    if (updates.socket_total && updates.system_units === 'Sockets') {
      requestData.socket_total = parseInt(`${updates.socket_total}`, 10);
      requestData.cpu_total = requestData.socket_total;
    }
    if (updates.cpu_total && updates.system_units === 'Cores/vCPU') {
      requestData.cpu_total = parseInt(`${updates.cpu_total}`, 10);
      requestData.socket_total = 1;
    }
    dispatch(editSubscriptionSettings(subscriptionID, requestData));
  };

  const handleSubmit = () => {
    submit(subscription.id, settings);
  };

  const handleCloseModal = () => {
    dispatch(clearEditSubscriptionSettingsResponse());
    dispatch(closeModal());
  };

  return (
    <Modal
      title="Subscription settings"
      secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
      width={810}
      variant="large"
      onClose={handleCloseModal}
      primaryText="Save"
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={handleCloseModal}
      isPrimaryDisabled={requestState.pending || !settings.isValid}
      isPending={requestState.pending}
    >
      <EditSubscriptionSettingsRequestState
        requestState={requestState as ErrorState}
        onFulfilled={() => {
          handleCloseModal();
          onClose();
        }}
      />
      <Form
        onSubmit={(e) => {
          handleSubmit();
          e.preventDefault();
        }}
        className="subscription-settings form"
      >
        <TextContent>
          <Text component={TextVariants.p}>
            Edit your subscription settings to receive the correct level of cluster support.
          </Text>
        </TextContent>
        <EditSubscriptionSettingsFields
          initialSettings={subscription}
          onSettingsChange={setSettings}
          canSubscribeStandardOCP={hasCapability(
            subscription,
            subscriptionCapabilities.SUBSCRIBED_OCP,
          )}
          canSubscribeMarketplaceOCP={hasCapability(
            subscription,
            subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE,
          )}
        />
      </Form>
    </Modal>
  );
};

EditSubscriptionSettingsDialog.modalName = modals.EDIT_SUBSCRIPTION_SETTINGS;

export default EditSubscriptionSettingsDialog;
