import React from 'react';
import { Title, Text } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import { ErrorState } from '~/types/types';
import { useDispatch } from 'react-redux';
import Modal from '~/components/common/Modal/Modal';
import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import { formatErrorDetails } from '../../../common/errors';
import { closeModal } from '../../common/Modal/ModalActions';

type Props = {
  title: string;
  errorResponse: ErrorState;
  onClose: (...args: any[]) => any;
};

const ShieldedVmErrorModal = ({ title, errorResponse, onClose }: Props) => {
  const dispatch = useDispatch();
  const close = () => {
    dispatch(closeModal());
    onClose();
  };
  const errorDetails = formatErrorDetails(errorResponse.errorDetails);

  return (
    <Modal
      header={
        <Title headingLevel="h2" size="2xl">
          <ExclamationCircleIcon color={global_danger_color_100.value} /> {title}
        </Title>
      }
      primaryText="Close"
      onPrimaryClick={close}
      onClose={close}
      showClose={false}
      showSecondary={false}
      aria-label={title}
    >
      <p>{errorResponse.errorMessage}</p>
      {errorDetails && <p>{errorDetails}</p>}
      <Text className="pf-v5-u-mt-sm">{`Operation ID: ${errorResponse.operationID || 'N/A'}`}</Text>
      <Text className="pf-v5-u-mt-sm">
        <ExternalLink href={links.OSD_CCS_GCP_SHEILDED_VM}>
          Learn more about Secure Boot
        </ExternalLink>
      </Text>
    </Modal>
  );
};

export default ShieldedVmErrorModal;
