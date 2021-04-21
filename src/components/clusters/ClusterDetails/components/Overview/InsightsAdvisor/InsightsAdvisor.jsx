import React from 'react';
import { PropTypes } from '@redhat-cloud-services/rule-components/dist/cjs/style-inject.es-de7bd8d6';
import { Flex, FlexItem, Title } from '@patternfly/react-core';

import InfoPopover from '../../../../../overview/InsightsAdvisorCard/InfoPopover';
import { groupRulesByRisk } from '../../Insights/InsightsSelectors';
import Chart from './Chart';

import './InsightsAdvisor.scss';

const InsightsAdvisor = ({ insightsData }) => {
  const filteredData = insightsData.data
    ? insightsData.data.filter(val => !val.disabled)
    : [];
  const entries = Object.entries(groupRulesByRisk(filteredData)).reverse();

  return (
    <Flex>
      <FlexItem>
        <Title className="ocm-c-overview-advisor--card__title" size="lg" headingLevel="h2">
          Advisor recommendations
        </Title>
        <InfoPopover />
      </FlexItem>
      <FlexItem>
        <Chart entries={entries} issueCount={filteredData.length} />
      </FlexItem>
    </Flex>
  );
};

InsightsAdvisor.propTypes = {
  insightsData: PropTypes.object,
};

export default InsightsAdvisor;
