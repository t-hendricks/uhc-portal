import React from 'react';
import { Flex } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import TotalRiskCard from './TotalRiskCard';
import GroupsCard from './GroupsCard';
import './index.scss';

const AnalysisSummary = ({ insightsData, batteryClicked, groupClicked, groups }) => (
  <Flex>
    <Flex grow={{ default: 'grow' }} alignSelf={{ default: 'alignSelfStretch' }}>
      <TotalRiskCard insightsData={insightsData} batteryClicked={batteryClicked} />
    </Flex>
    <Flex grow={{ default: 'grow' }} alignSelf={{ default: 'alignSelfStretch' }}>
      <GroupsCard insightsData={insightsData} groups={groups} groupClicked={groupClicked} />
    </Flex>
  </Flex>
);

AnalysisSummary.propTypes = {
  insightsData: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  batteryClicked: PropTypes.func.isRequired,
  groupClicked: PropTypes.func.isRequired,
};

export default AnalysisSummary;
