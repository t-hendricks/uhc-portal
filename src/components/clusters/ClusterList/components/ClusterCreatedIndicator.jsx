import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import dayjs from 'dayjs';
import { Popover, PopoverPosition, Button, Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import ExternalLink from '../../../common/ExternalLink';
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
          icon={
            <Icon>
              <ExclamationTriangleIcon color={global_warning_color_100.value} />
            </Icon>
          }
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
      return dayjs(cluster.creation_timestamp).format('DD MMM YYYY');
    }
    return 'N/A';
  }

  // display error that it has expired
  if (supportLevel === subscriptionSupportLevels.NONE) {
    return (
      <Popover
        position={PopoverPosition.top}
        bodyContent="Your 60-day evaluation has expired. Edit subscription settings to continue using this cluster, or archive this cluster if it no longer exists."
        aria-label="Evaluation expired"
      >
        <Button
          variant="link"
          isInline
          icon={
            <Icon>
              <ExclamationCircleIcon color={global_danger_color_100.value} />
            </Icon>
          }
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
        Your OCP cluster evaluation will expire in&nbsp;
        {OCPTrialExpiresStr}
        &nbsp;on&nbsp;
        <strong>
          <DateFormat date={subscription.eval_expiration_date} type="onlyDate" />
        </strong>
        .&nbsp;Your cluster is not&nbsp;
        <ExternalLink
          href="https://access.redhat.com/support/policy/updates/openshift/policies"
          noIcon
          noTarget
        >
          supported
        </ExternalLink>
        . To get Red Hat support for clusters, learn more about{' '}
        <ExternalLink
          href="https://www.redhat.com/en/resources/self-managed-openshift-sizing-subscription-guide"
          noIcon
          noTarget
        >
          OCP subscriptions
        </ExternalLink>
        . Though your cluster will be functional.
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
        icon={
          <Icon>
            <ExclamationTriangleIcon color={global_warning_color_100.value} />
          </Icon>
        }
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
