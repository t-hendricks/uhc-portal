import React from 'react';
import PropTypes from 'prop-types';
import { Title, Flex, FlexItem } from '@patternfly/react-core';
import { ChartPie, ChartLegend } from '@patternfly/react-charts';
import { groupTagHitsByGroups } from '../overviewHelpers';

function ChartByGroups({ tagHits, groups }) {
  const groupedRulesByGroups = groupTagHitsByGroups(tagHits, [...groups]);

  return (
    <Flex className="ocm-insights--groups-chart" direction={{ default: 'column' }}>
      <FlexItem>
        <Title size="lg" headingLevel="h2">
          Recommendations by category
        </Title>
      </FlexItem>
      <FlexItem>
        <ChartPie
          ariaTitle="Categories statistics"
          constrainToVisibleArea
          data={Object.entries(groupedRulesByGroups)
            .map(([title, group]) => ({ x: title, y: group.count }))}
          width={400}
          height={120}
          padding={{
            bottom: 30,
            left: 0,
            right: 300, // Adjusted to accommodate legend
            top: 10,
          }}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          legendData={Object.entries(groupedRulesByGroups).map(([title, group]) => ({ name: `${title}: ${group.count}`, tags: group.tags }))}
          legendPosition="right"
          legendAllowWrap
          legendComponent={(
            <ChartLegend
              height={100}
              width={200}
              itemsPerRow={2}
              orientation="horizontal"
              className="pf-m-redhat-font"
              rowGutter={0}
              style={{ labels: { fontSize: 12 } }}
            />
              )}
        />
      </FlexItem>
    </Flex>
  );
}

export default ChartByGroups;

ChartByGroups.propTypes = {
  tagHits: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};
