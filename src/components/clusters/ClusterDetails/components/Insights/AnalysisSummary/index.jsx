import React from 'react';
import {
  Flex, FlexModifiers,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import TotalRiskCard from './TotalRiskCard';
import GroupsCard from './GroupsCard';
import './index.css';

const AnalysisSummary = ({
  insightsData, batteryClicked, groupClicked, groups,
}) => (
  <Flex>
    <Flex breakpointMods={[{ modifier: FlexModifiers.grow }, { modifier: FlexModifiers['align-self-stretch'] }]}>
      <TotalRiskCard insightsData={insightsData} batteryClicked={batteryClicked} />
    </Flex>
    <Flex breakpointMods={[{ modifier: FlexModifiers['align-self-stretch'] }]}>
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
