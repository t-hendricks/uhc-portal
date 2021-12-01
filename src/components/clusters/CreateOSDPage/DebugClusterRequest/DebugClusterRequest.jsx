import React from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  ExpandableSection,
  GridItem,
} from '@patternfly/react-core';

import { createClusterRequest, upgradeScheduleRequest } from '../submitOSDRequest';

/** Displays the to-be-sent requests - to be shown only in debug mode */
const DebugClusterRequest = ({ formValues, cloudProviderID, product }) => {
  let clusterRequest;
  try {
    clusterRequest = createClusterRequest({ cloudProviderID, product }, formValues);
  } catch (err) {
    clusterRequest = `error computing cluster request: ${err}`;
  }

  let upgradeSchedule;
  try {
    upgradeSchedule = upgradeScheduleRequest(formValues);
    if (!upgradeSchedule) {
      upgradeSchedule = 'Manual upgrade strategy, no request to be made.';
    }
  } catch (err) {
    upgradeSchedule = `error computing upgrade request: ${err}`;
  }

  return (
    <GridItem span={12}>
      <Banner variant="info">
        <ExpandableSection toggleText="Debug: cluster request to be sent">
          <pre>
            {JSON.stringify(clusterRequest, null, 2)}
          </pre>
        </ExpandableSection>
        <ExpandableSection toggleText="Debug: upgrade schedule request to be sent">
          <pre>
            {JSON.stringify(upgradeSchedule, null, 2)}
          </pre>
        </ExpandableSection>
      </Banner>
    </GridItem>
  );
};
DebugClusterRequest.propTypes = {
  formValues: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string,
  product: PropTypes.string,
};

export default DebugClusterRequest;
