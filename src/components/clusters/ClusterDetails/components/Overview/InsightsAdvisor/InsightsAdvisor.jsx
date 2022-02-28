import React from 'react';
import { PropTypes } from 'prop-types';
import { Flex, FlexItem, Title } from '@patternfly/react-core';

import InfoPopover from '../../../../../overview/InsightsAdvisorCard/InfoPopover';
import { groupRulesByRisk } from '../../Insights/InsightsSelectors';
import Chart from './Chart';

import './InsightsAdvisor.scss';

const InsightsAdvisor = ({ insightsData, externalId }) => {
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
        <Chart entries={entries} issueCount={filteredData.length} externalId={externalId} />
      </FlexItem>
    </Flex>
  );
};

InsightsAdvisor.propTypes = {
  insightsData: PropTypes.object,
  // external id is always available when insights data got 200 and the widget is thus rendered
  externalId: PropTypes.string.isRequired,
};

export default InsightsAdvisor;
