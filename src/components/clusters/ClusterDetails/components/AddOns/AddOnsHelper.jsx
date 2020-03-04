import React from 'react';

import get from 'lodash/get';
import has from 'lodash/has';

import { Button } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_success_color_100, global_danger_color_100 } from '@patternfly/react-tokens';

import AddOnsConstants from './AddOnsConstants';

const getAddOnConsoleButton = (cluster, addOn, installedAddOn) => {
  const addOnURL = `${cluster.console.url}/k8s/ns/${addOn.target_namespace}/operators.coreos.com~v1alpha1~ClusterServiceVersion/${addOn.id}.v${installedAddOn.operator_version}`;
  return (
    <a href={addOnURL} target="_blank" rel="noopener noreferrer">
      <Button variant="secondary">View in console</Button>
    </a>
  );
};

const getInstallState = (addOn, clusterAddOns, cluster) => {
  const installedAddOn = clusterAddOns.items.find(item => item.addon.id === addOn.id);
  if (!installedAddOn) {
    return '';
  }

  let icon = '';
  let state = '';
  let action = '';

  switch (installedAddOn.state) {
    case AddOnsConstants.INSTALLATION_STATE.PENDING:
    case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
    case undefined:
      // undefined state implies that the user just started
      // the installation and there is no state available yet
      icon = <InProgressIcon size="md" />;
      state = 'Installing';
      break;
    case AddOnsConstants.INSTALLATION_STATE.DELETING:
      icon = <InProgressIcon size="md" />;
      state = 'Deleting';
      break;
    case AddOnsConstants.INSTALLATION_STATE.FAILED:
      icon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
      state = 'Install failed';
      action = <a href="mailto:ocm-feedback@redhat.com" rel="noreferrer noopener" target="_blank">Contact support</a>;
      break;
    case AddOnsConstants.INSTALLATION_STATE.READY:
      icon = <CheckCircleIcon color={global_success_color_100.value} size="md" />;
      state = 'Installed';
      action = getAddOnConsoleButton(cluster, addOn, installedAddOn);
      break;
    default:
      icon = <UnknownIcon size="md" />;
      state = 'Unknown';
      break;
  }

  return (
    <>
      { icon }
      <span>{ state }</span>
      { action }
    </>
  );
};

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, organization, quota) => {
  if (!addOn.enabled || !organization.fulfilled) {
    return false;
  }

  // If the add-on is not in the quota summary, it should not be available
  return has(quota.addOnsQuota, addOn.resource_name);
};

const isInstalled = (addOn, clusterAddOns) => {
  if (!get(clusterAddOns, 'items.length', false)) {
    return false;
  }

  return clusterAddOns.items.some(clusterAddOn => clusterAddOn.addon.id === addOn.id);
};

// An add-on can only be installed if the org has quota for this particular add-on
const hasQuota = (addOn, organization, quota) => {
  if (!isAvailable(addOn, organization, quota)) {
    return false;
  }

  return get(quota.addOnsQuota, addOn.resource_name, 0) >= addOn.resource_cost;
};

const availableAddOns = (addOns, clusterAddOns, organization, quota) => {
  if (!get(addOns, 'items.length', false)) {
    return [];
  }

  return addOns.items.filter(addOn => isAvailable(addOn, organization, quota)
                             || isInstalled(addOn, clusterAddOns));
};

export {
  getInstallState,
  isAvailable,
  isInstalled,
  hasQuota,
  availableAddOns,
};
