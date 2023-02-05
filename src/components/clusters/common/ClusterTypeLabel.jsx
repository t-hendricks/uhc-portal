import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';

import get from 'lodash/get';

import { normalizedProducts } from '../../../common/subscriptionTypes';

function ClusterTypeLabel({ cluster }) {
  const clusterTypes = {
    [normalizedProducts.OCP]: {
      name: 'OCP',
      tooltip: 'Self-managed OpenShift Container Platform (OCP) cluster',
    },
    [normalizedProducts.OCP_Assisted_Install]: {
      name: 'OCP',
      tooltip: 'Self-managed OpenShift Container Platform (OCP) cluster',
    },
    [normalizedProducts.OSD]: {
      name: 'OSD',
      tooltip: 'OpenShift Dedicated (OSD) cluster managed by Red Hat',
    },
    [normalizedProducts.OSDTrial]: {
      name: 'OSD Trial',
      tooltip: 'OpenShift Dedicated (OSD) cluster trial managed by Red Hat',
    },
    [normalizedProducts.RHMI]: {
      name: 'RHMI',
      tooltip: 'Red Hat Managed Integration',
    },
    [normalizedProducts.ROSA]: {
      name: 'ROSA - Standalone',
      tooltip: 'Red Hat OpenShift Service on AWS - Standalone control plane',
    },
    [normalizedProducts.ROSA_HyperShift]: {
      name: 'ROSA - Hosted',
      tooltip: 'Red Hat OpenShift Service on AWS - Hosted control plane',
    },
    [normalizedProducts.ARO]: {
      name: 'ARO',
      tooltip: 'Red Hat OpenShift Service on Azure',
    },
    [normalizedProducts.UNKNOWN]: {
      name: 'N/A',
      tooltip: 'Not Available',
    },
  };

  const planType = get(cluster, 'subscription.plan.id', normalizedProducts.UNKNOWN);

  const type = clusterTypes[planType] || clusterTypes[normalizedProducts.UNKNOWN];
  return (
    <Tooltip content={type.tooltip}>
      <span>{type.name}</span>
    </Tooltip>
  );
}

ClusterTypeLabel.propTypes = {
  cluster: PropTypes.shape({
    product: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(normalizedProducts)).isRequired,
    }),
  }),
};

export default ClusterTypeLabel;
