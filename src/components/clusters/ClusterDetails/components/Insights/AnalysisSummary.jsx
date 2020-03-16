import React from 'react';
import {
  Button,
  Card,
  CardBody, Grid, GridItem,
  Split,
  SplitItem,
  Stack,
  StackItem, Text,
  Title
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import { severity } from '@redhat-cloud-services/rule-components';
import PropTypes from 'prop-types';
import { RemoteHealthPopover } from './EmptyTableMessage';
import { severityMapping } from './helpers';

const groupRulesByRisk = data => data.reduce(
  (acc, { total_risk: totalRisk }) => ({
    ...acc,
    [totalRisk]: acc[totalRisk] ? acc[totalRisk] + 1 : 1
  }),
  {},
);

const AnalysisSummary = ({ insights, batteryClicked }) => (
  <Card>
    <CardBody>
      <Grid>
        <GridItem span={9}>
          <Split>
            <SplitItem>
              <ExclamationTriangleIcon
                className="title-icon"
                width={18}
                height={18}
              />
            </SplitItem>
            <SplitItem className="description">
              <Stack>
                <StackItem>
                  <Title headingLevel="h2" size="xl">
                    {`Remote health detected ${insights.meta.count} issues`}
                  </Title>
                </StackItem>
                <StackItem>
                  <Text>Last checked: 4 minutes ago</Text>
                </StackItem>
                <StackItem>
                  <RemoteHealthPopover />
                </StackItem>
              </Stack>
            </SplitItem>
          </Split>
        </GridItem>

        <GridItem span={3}>
          <Stack>
            {
              Object.entries(groupRulesByRisk(insights.data))
                .map(([risk, count]) => (
                  <StackItem className="battery">
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

AnalysisSummary.propTypes = {
  insights: PropTypes.object.isRequired,
  batteryClicked: PropTypes.func.isRequired,
};

export default AnalysisSummary;
