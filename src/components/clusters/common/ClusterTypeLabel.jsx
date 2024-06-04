import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from '@patternfly/react-core';

import { clusterType } from './clusterType';

function ClusterTypeLabel({ cluster }) {
  const type = clusterType(cluster);

  return (
    <Tooltip content={type.tooltip}>
      <span data-testid="clusterType">
        {type.name}
        {type.label && (
          <>
            <br />
            {type.label}
          </>
        )}
      </span>
    </Tooltip>
  );
}

ClusterTypeLabel.propTypes = {
  cluster: PropTypes.shape({}),
};

export default ClusterTypeLabel;
