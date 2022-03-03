import React from 'react';
import PropTypes from 'prop-types';
import { Title, Flex, FlexItem } from '@patternfly/react-core';
import { ChartPie, ChartLegend } from '@patternfly/react-charts';
import { groupTagHitsByGroups } from '../overviewHelpers';

export const categoryMapping = {
  service_availability: 1,
  performance: 2,
  fault_tolerance: 3,
  security: 4,
};

/* PF's ChartLabel doesn't allow to create a link from the part of the label,
   thus, the custom title component is used */
const TitleComponent = ({
  data, index, x, y, style,
}) => {
  const entity = data[index];
  const { name, count, tags } = entity;

  return (
    <text x={x} y={y} style={style} dy={5}>
      <tspan x={x} y={y}>
        {name}
        :
        {' '}
        <a
          href={`${window.location.origin}/${APP_BETA ? 'beta/' : ''}openshift/insights/advisor/recommendations?category=${categoryMapping[tags]}`}
          className="enabled-link"
        >
          {count}
        </a>
      </tspan>
    </text>
  );
};

TitleComponent.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

const ChartByGroups = ({ tagHits, groups }) => {
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
          legendData={
            Object.entries(groupedRulesByGroups)
              .map(([title, { count, tags }]) => ({
                name: title, count, tags, symbol: { type: 'circle' },
              }))
          }
          legendPosition="right"
          legendAllowWrap
          legendComponent={(
            <ChartLegend
              labelComponent={<TitleComponent />}
              height={100}
              width={300}
              itemsPerRow={2}
              orientation="horizontal"
              className="pf-m-redhat-font"
              style={{ labels: { fontSize: 12 } }}
              gutter={30}
            />
          )}
        />
      </FlexItem>
    </Flex>
  );
};

ChartByGroups.propTypes = {
  tagHits: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};

export default ChartByGroups;
