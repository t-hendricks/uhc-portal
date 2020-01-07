import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import forOwn from 'lodash/forOwn';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

import { entitlementStatuses } from '../../../common/subscriptionTypes';
import { buildUrlParams } from '../../../common/queryHelpers';
import OCPSubscriptionCategory from './OCPSubscriptionCategory';


function OCPSubscriptionSummary({ stats }) {
  const items = [];
  forOwn(stats, (numClusters, entitlementStatus) => {
    if (numClusters > 0) {
      const item = {
        status: entitlementStatus,
        text: null,
        hint: null,
        link: null,
      };

      switch (entitlementStatus) {
        case entitlementStatuses.NOT_SET:
          item.text = 'Not subscribed';
          item.hint = 'Clusters do not have subscriptions attached.';
          break;
        case entitlementStatuses.OVERCOMMITTED:
          item.text = 'Insufficient';
          item.hint = 'Clusters are consuming more resources than they are entitled to.';
          break;
        case entitlementStatuses.INCONSISTENT_SERVICES:
          item.text = 'Invalid';
          item.hint = 'Clusters are attached to subscriptions with different support levels.';
          break;
        default:
      }

      const params = { entitlement_status: entitlementStatus, plan_id: 'OCP' };
      item.link = (
        <Link to={{ pathname: '/', search: buildUrlParams(params) }}>
          {`${numClusters} Cluster${numClusters === 1 ? '' : 's'}`}
        </Link>
      );

      items.push(item);
    }
  });

  const okCategory = [
    entitlementStatuses.OK,
  ];
  const warnCategory = [
    entitlementStatuses.NOT_SET,
    entitlementStatuses.OVERCOMMITTED,
    entitlementStatuses.INCONSISTENT_SERVICES,
  ];
  const unknownCategory = [
    entitlementStatuses.UNKNOWN,
  ];
  return (
    <>
      <h4 className="content-header">Subscription Status</h4>
      <OCPSubscriptionCategory
        labelText="Properly entitled"
        labelIcon={<CheckCircleIcon className="status-icon ok-icon" />}
        labelClass="ok-label"
        items={items.filter(item => okCategory.includes(item.status))}
      />
      <OCPSubscriptionCategory
        labelText="Subscription issues"
        labelIcon={<ExclamationTriangleIcon className="status-icon warn-icon" />}
        labelClass="warn-label"
        items={items.filter(item => warnCategory.includes(item.status))}
      />
      <OCPSubscriptionCategory
        labelText="Unknown"
        labelIcon={<UnknownIcon className="status-icon unknown-icon" />}
        labelClass="unknown-label"
        labelHint="Subscription status for new clusters may not be available for a few minutes after being created."
        items={items.filter(item => unknownCategory.includes(item.status))}
      />
    </>
  );
}

OCPSubscriptionSummary.propTypes = {
  stats: PropTypes.object.isRequired,
};

export default OCPSubscriptionSummary;
