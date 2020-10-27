import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import get from 'lodash/get';

function ClusterTypeLabel({ cluster }) {
  const clusterTypes = {
    ocp: {
      name: 'OCP',
      tooltip: 'Self-managed OpenShift Container Platform (OCP) cluster',
    },
    osd: {
      name: 'OSD',
      tooltip: 'OpenShift Dedicated (OSD) cluster managed by Red Hat',
    },
    rhmi: {
      name: 'RHMI',
      tooltip: 'Red Hat Managed Integration',
    },
    moa: {
      name: 'ROSA',
      tooltip: 'Red Hat OpenShift Service on AWS',
    },
    rosa: {
      name: 'ROSA',
      tooltip: 'Red Hat OpenShift Service on AWS',
    },
    UnknownClusterType: {
      name: 'N/A',
      tooltip: 'Not Available',
    },
  };

  const typeId = get(cluster, 'product.id', 'UnknownClusterType');
  const type = clusterTypes[typeId] || clusterTypes.UnknownClusterType;
  return (
    <Tooltip
      content={type.tooltip}
    >
      <span>
        {type.name}
      </span>
    </Tooltip>
  );
}

ClusterTypeLabel.propTypes = {
  cluster: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default ClusterTypeLabel;
