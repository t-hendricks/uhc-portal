import React from 'react';
import {
  Button,
  Card,
  CardBody, Grid, GridItem,
  Split,
  SplitItem,
  Stack,
  StackItem, Text,
  Title,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import { severity } from '@redhat-cloud-services/rule-components';
import PropTypes from 'prop-types';
import { RemoteHealthPopover } from './EmptyTableMessage';
import { severityMapping } from './helpers';

const groupRulesByRisk = data => data.reduce(
  (acc, { total_risk: totalRisk }) => ({
    ...acc,
    [totalRisk]: acc[totalRisk] ? acc[totalRisk] + 1 : 1,
  }),
  {},
);

const AnalysisSummary = ({ insightsData, batteryClicked }) => {
  const groupedRules = groupRulesByRisk(insightsData.data);
  return (
    <Card>
      <CardBody>
        <Grid>
          <GridItem span={9}>
            <Split>
              <SplitItem>
                {
                Object.keys(groupedRules).reduce((a, b) => Math.max(a, b)) < 4
                  ? (
                    <ExclamationTriangleIcon
                      className="title-icon"
                      width={18}
                      height={18}
                    />
                  )
                  : (
                    <ExclamationCircleIcon
                      className="title-icon danger"
                      width={18}
                      height={18}
                    />
                  )
              }
              </SplitItem>
              <SplitItem className="description">
                <Stack>
                  <StackItem key="remote-health-description">
                    <Title headingLevel="h2" size="xl">
                      {`Remote health detected ${insightsData.meta.count} issue${insightsData.meta.count > 1 ? 's' : ''}`}
                    </Title>
                  </StackItem>
                  <StackItem key="remote-health-last-checked">
                    <Text>
                      {'Last checked: '}
                      <DateFormat date={new Date(insightsData.meta.last_checked_at)} />
                    </Text>
                  </StackItem>
                  <StackItem key="remote-health-popover">
                    <RemoteHealthPopover />
                  </StackItem>
                </Stack>
              </SplitItem>
            </Split>
          </GridItem>

          <GridItem span={3}>
            <Stack>
              {
              Object.entries(groupedRules)
                .map(([risk, count]) => (
                  <StackItem key={risk} className="battery">
                    <Battery
                      label={severity[severityMapping[risk - 1]]}
                      severity={parseInt(risk, 10)}
                      labelHidden
                    />
                    <Button
                      variant="link"
                      onClick={() => batteryClicked(severityMapping[risk - 1])}
                    >
                      {`${count} ${severity[severityMapping[risk - 1]]}`}
                    </Button>
                  </StackItem>
                ))
            }
            </Stack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

AnalysisSummary.propTypes = {
  insightsData: PropTypes.object.isRequired,
  batteryClicked: PropTypes.func.isRequired,
};

export default AnalysisSummary;
