/* eslint-disable camelcase */

import React from 'react';
import {
  Card,
  CardBody,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';

import {
  c_button_m_control_active_after_BorderBottomColor,
  global_palette_blue_50,
  global_palette_blue_300,
  global_palette_gold_400,
  global_palette_orange_300,
  global_palette_red_200,
  global_primary_color_200,
} from '@patternfly/react-tokens';
import get from 'lodash/get';
import { ChartBar, ChartStack, ChartLegend, createContainer } from '@patternfly/react-charts';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { severity } from '@redhat-cloud-services/rule-components/RuleTable/constants';
import PropTypes from 'prop-types';
import { RemoteHealthPopover } from '../EmptyTableMessage';
import { severityMapping } from '../helpers';

const groupRulesByRisk = (data) =>
  data.reduce(
    (acc, { total_risk: totalRisk }) => ({
      ...acc,
      [totalRisk]: acc[totalRisk] ? acc[totalRisk] + 1 : 1,
    }),
    {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
  );

const colorScale = [
  global_palette_blue_50.value,
  global_palette_gold_400.value,
  global_palette_orange_300.value,
  global_palette_red_200.value,
];

const legendColorScale = [
  global_palette_blue_300.value,
  global_palette_gold_400.value,
  global_palette_orange_300.value,
  global_palette_red_200.value,
];

const mouseOverClickMutation = (props) => ({
  style: {
    ...props.style,
    fill: global_primary_color_200.value,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

const TotalRiskCard = ({ insightsData, batteryClicked }) => {
  const filteredData = insightsData.data ? insightsData.data.filter((val) => !val.disabled) : [];
  const groupedRules = groupRulesByRisk(filteredData);
  const issueCount = filteredData.length;
  const lastChecked = get(insightsData, 'meta.last_checked_at', 0);

  const CursorVoronoiContainer = createContainer('voronoi');

  return (
    <Card className="insights-analysis-card" ouiaId="summaryByRisk">
      <CardBody>
        <Stack>
          <StackItem>
            <Split>
              <SplitItem isFilled>
                <Title headingLevel="h2" size="xl">
                  {`${issueCount} potential issue${issueCount > 1 ? 's' : ''} identified`}
                </Title>
              </SplitItem>
              <SplitItem className="cluster-insights-description">
                <Text>
                  {'Last check: '}
                  <DateFormat date={new Date(lastChecked)} />
                </Text>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <ChartStack
              ariaDesc="Total risk chart"
              ariaTitle="Total risk chart"
              containerComponent={
                <CursorVoronoiContainer
                  mouseFollowTooltips
                  labels={({ datum }) => `${datum.name}: ${datum.y}`}
                />
              }
              height={40}
              width={550}
              padding={{
                bottom: 0,
                left: 0,
                right: 0,
                top: 20,
              }}
              horizontal
            >
              {Object.entries(groupedRules)
                .reverse()
                .map(([risk, count]) => (
                  <ChartBar
                    key={risk}
                    name={`bar-${risk}`}
                    barWidth={20}
                    data={[
                      {
                        name: severity[severityMapping[risk - 1]],
                        x: 1,
                        y: count,
                      },
                    ]}
                    style={{ data: { fill: colorScale[risk - 1] } }}
                  />
                ))}
            </ChartStack>
          </StackItem>
          <StackItem isFilled>
            <ChartLegend
              responsive={false}
              height={40}
              width={550}
              padding={{
                margin: 0,
                bottom: 0,
                left: 0,
                right: 0,
                top: -50,
              }}
              className="pf-m-redhat-font"
              style={{
                labels: {
                  fill: c_button_m_control_active_after_BorderBottomColor.value,
                },
              }}
              events={[
                {
                  target: 'labels',
                  eventHandlers: {
                    onMouseOver: () => [
                      {
                        mutation: (props) => mouseOverClickMutation(props),
                      },
                    ],
                    onMouseOut: () => [
                      {
                        mutation: () => null,
                      },
                    ],
                    onClick: () => [
                      {
                        mutation: (props) => {
                          // eslint-disable-next-line react/prop-types
                          batteryClicked(severityMapping[parseInt(props.datum.severity, 10) - 1]);
                          return mouseOverClickMutation(props);
                        },
                      },
                    ],
                  },
                },
              ]}
              data={Object.entries(groupedRules)
                .reverse()
                .map(([risk, count]) => ({
                  name: `${count} ${severity[severityMapping[risk - 1]]}`,
                  severity: risk,
                  symbol: { type: 'circle', fill: legendColorScale[risk - 1] },
                }))}
            />
          </StackItem>
          <StackItem>
            <RemoteHealthPopover />
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

TotalRiskCard.propTypes = {
  insightsData: PropTypes.object.isRequired,
  batteryClicked: PropTypes.func.isRequired,
};

export default TotalRiskCard;
