/* eslint-disable camelcase */

import React from 'react';
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Title,
  Popover,
} from '@patternfly/react-core';
import {
  c_button_m_control_active_after_BorderBottomColor,
  global_primary_color_200,
  global_Color_dark_200,
} from '@patternfly/react-tokens';
import { ChartPie, ChartLegend } from '@patternfly/react-charts';
import { HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

export const groupRulesByGroups = (data, groups) => groups
  .sort((a, b) => a.title.localeCompare(b.title))
  .reduce(
    (acc, { tags, title }) => ({
      ...acc,
      [title]: {
        count: data.reduce((a, v) => (v.tags.filter(x => tags.includes(x)).length > 0
          ? a + 1
          : a),
        0),
        tags: tags.join(','),
      },
    }),
    {},
  );

const mouseOverClickMutation = props => ({
  style: {
    ...props.style,
    fill: global_primary_color_200.value,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

const GroupsCard = ({ insightsData, groups, groupClicked }) => {
  const groupedRulesByGroups = groupRulesByGroups(insightsData.data || [], [...groups]);

  return (
    <Card className="insights-analysis-card group-card" ouiaId="summaryByCategory">
      <CardBody>
        <Stack>
          <StackItem>
            <Title className="group-card-title" headingLevel="h2" size="xl">
              Recommendations by category
            </Title>
            <Popover
              position="right"
              maxWidth="22rem"
              bodyContent={(
                <p>
                  Insights recommendations grouped by the category
                </p>
              )}
              aria-label="What is Grouping?"
              boundary="viewport"
              enableFlip
            >
              <HelpIcon color={global_Color_dark_200.value} className="group-card-icon" />
            </Popover>
          </StackItem>
          <StackItem>
            <ChartPie
              ariaDesc="Groups statistics"
              ariaTitle="Groups statistics"
              constrainToVisibleArea
              data={Object.entries(groupedRulesByGroups)
                .map(([title, group]) => ({ x: title, y: group.count }))}
              height={140}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={Object.entries(groupedRulesByGroups).map(([title, group]) => ({ name: `${title}: ${group.count}`, tags: group.tags }))}
              legendOrientation="vertical"
              legendPosition="right"
              legendComponent={(
                <ChartLegend
                  responsive={false}
                  height={140}
                  width={200}
                  className="pf-m-redhat-font"
                  style={{
                    labels: {
                      fill: c_button_m_control_active_after_BorderBottomColor.value,
                    },
                  }}
                  events={[{
                    target: 'labels',
                    eventHandlers: {
                      onMouseOver: () => [{
                        mutation: props => mouseOverClickMutation(props),
                      }],
                      onMouseOut: () => [{
                        mutation: () => null,
                      }],
                      onClick: () => [{
                        mutation: (props) => {
                          // eslint-disable-next-line react/prop-types
                          groupClicked(props.datum.tags);
                          return mouseOverClickMutation(props);
                        },
                      }],
                    },
                  }]}
                />
              )}
              padding={{
                bottom: 25,
                left: -20,
                right: 200, // Adjusted to accommodate legend
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
  groupClicked: PropTypes.func.isRequired,
};

export default GroupsCard;
