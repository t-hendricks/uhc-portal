import React from 'react';
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { ChartPie } from '@patternfly/react-charts';
import PropTypes from 'prop-types';

const groupRulesByGroups = (data, groups) => groups.reduce(
  (acc, { tags, title }) => ({
    ...acc,
    [title]: data.reduce((a, v) => (v.tags.filter(x => tags.includes(x)).length > 0
      ? a + 1
      : a),
    0),
  }),
  {},
);

const GroupsCard = ({ insightsData, groups }) => {
  const groupedRulesByGroups = groupRulesByGroups(insightsData.data, groups);

  return (
    <Card className="insights-analysis-card">
      <CardBody>
        <Stack>
          <StackItem>
            <Title headingLevel="h2" size="xl">
              Health checks by category
            </Title>
          </StackItem>
          <StackItem>
            <ChartPie
              ariaDesc="Groups statistics"
              ariaTitle="Groups statistics"
              constrainToVisibleArea
              data={Object.entries(groupedRulesByGroups)
                .map(([title, count]) => ({ x: title, y: count }))}
              height={140}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={Object.entries(groupedRulesByGroups).map(([title, count]) => ({ name: `${title}: ${count}` }))}
              legendOrientation="vertical"
              legendPosition="right"
              padding={{
                bottom: 0,
                left: -40,
                right: 140, // Adjusted to accommodate legend
                top: 25,
              }}
              width={350}
            />
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

GroupsCard.propTypes = {
  insightsData: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};

export default GroupsCard;
