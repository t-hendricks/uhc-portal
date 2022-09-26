import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { Popover, PopoverPosition, Button } from '@patternfly/react-core';
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
// eslint-disable-next-line camelcase
import { global_warning_color_100, global_danger_color_100 } from '@patternfly/react-tokens';
import {
  subscriptionSupportLevels,
  normalizedProducts,
} from '../../../../common/subscriptionTypes';
import { getTrialExpiresInDays, getTrialEndDate } from '../../../../common/getTrialExpiresDates';

function ClusterCreatedIndicator({ cluster }) {
  const osdtrial = get(cluster, 'product.id') === normalizedProducts.OSDTrial;
  const managed = get(cluster, 'managed');
  const supportLevel = get(cluster, 'subscription.support_level');
  const subscription = get(cluster, 'subscription');

  if (osdtrial) {
    const trialExpiresStr = getTrialExpiresInDays(cluster, true);
    const trialEndDate = getTrialEndDate(cluster);
    const bodyContent = (
      <>
        <h1>
          <strong>Trial Cluster</strong>
        </h1>
        <p>
          Your free trial cluster will automatically be deleted in&nbsp;
          {trialExpiresStr}
          &nbsp;on&nbsp;
          <strong>{trialEndDate}</strong>
        </p>
      </>
    );
    return (
      <Popover
        position={PopoverPosition.top}
        aria-label="Trial Expiration date"
        bodyContent={bodyContent}
      >
        <Button
          variant="link"
          isInline
          icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}
        >
          {trialExpiresStr}
          &nbsp; left
        </Button>
      </Popover>
    );
  }

  if (
    managed ||
    (supportLevel !== subscriptionSupportLevels.EVAL &&
      supportLevel !== subscriptionSupportLevels.NONE)
  ) {
    const clusterCreationTime = get(cluster, 'creation_timestamp', false);
    if (clusterCreationTime) {
      return moment(cluster.creation_timestamp).format('DD MMM YYYY');
    }
    return 'N/A';
  }

  // display error that it has expired
  if (supportLevel === subscriptionSupportLevels.NONE) {
    return (
      <Popover
        position={PopoverPosition.top}
        bodyContent="Your 60-day evaluation has expired. Edit subscription settings to continue using this cluster, or archive this cluster if it no longer exits"
        aria-label="Evaluation expired"
      >
        <Button
          variant="link"
          isInline
          icon={<ExclamationCircleIcon color={global_danger_color_100.value} />}
        >
          Evaluation expired
        </Button>
      </Popover>
    );
  }
  const OCPTrialExpiresStr = getTrialExpiresInDays(cluster, false);
  const OCPTrialBodyContent = (
    <>
      <h1>
        <strong>OCP Cluster</strong>
      </h1>
      <p>
        Your OCP cluster will expire in&nbsp;
        {OCPTrialExpiresStr}
        &nbsp;on&nbsp;
        <strong>
          <DateFormat date={subscription.eval_expiration_date} type="onlyDate" />
        </strong>
        &nbsp;once expired, your cluster will remain unsupported.
      </p>
    </>
  );
  // display "xx days remaining" for grace period
  return (
    <Popover
      position={PopoverPosition.top}
      bodyContent={OCPTrialBodyContent}
      aria-label="Trial Expiration date"
    >
      <Button
        variant="link"
        isInline
        icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}
      >
        {OCPTrialExpiresStr}
        &nbsp; left
      </Button>
    </Popover>
  );
}

ClusterCreatedIndicator.propTypes = {
  cluster: PropTypes.shape({
    managed: PropTypes.bool,
    subscription: PropTypes.shape({
      support_level: PropTypes.string,
    }),
    creation_timestamp: PropTypes.string,
  }),
};

export default ClusterCreatedIndicator;
