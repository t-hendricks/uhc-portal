import React from 'react';

import {
  Card, CardBody, Title, Popover, Button,
  Grid, GridItem, Stack, StackItem,
} from '@patternfly/react-core';
import { RuleTable, severity, ReportDetails } from '@redhat-cloud-services/rule-components';
import {
  descriptionFilter,
  totalRiskFilter,
} from '@redhat-cloud-services/rule-components/dist/cjs/RuleFilters';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import '@redhat-cloud-services/frontend-components/components/Battery.css';
import './RulesTable.css';

const severityMapping = Object.keys(severity);

class Insights extends React.Component {
  state = {
    meta: {
      count: 4,
    },
    data: [
      {
        ruleId: 1,
        description: 'rule 1 description',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header


\`\`\`some code\`\`\`
        `,
        created_at: 1583245000000,
        total_risk: 3,
        risk_of_change: 1,
      },
      {
        ruleId: 2,
        description: 'Some rule description2',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header


\`\`\`some code\`\`\`
        `,
        created_at: 1583245000000,
        total_risk: 4,
        risk_of_change: 2,
      },
      {
        ruleId: 3,
        description: 'Some rule description3',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header


\`\`\`some code\`\`\`
        `,
        created_at: 1583245000000,
        total_risk: 1,
        risk_of_change: 3,
      },
    ],
    shownData: [
      {
        ruleId: 1,
        description: 'rule 1 description',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header
        `,
        created_at: 1583245000000,
        total_risk: 3,
        risk_of_change: 4,
      },
      {
        ruleId: 2,
        description: 'Some rule description2',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header


\`\`\`some code\`\`\`
        `,
        created_at: 1583245000000,
        total_risk: 4,
        risk_of_change: 1,
      },
      {
        ruleId: 3,
        description: 'Some rule description3',
        details: `
Some *rule* description

> quoute

test
multiline

[link text](https://g.co)

# header


\`\`\`some code\`\`\`
        `,
        created_at: 1583245000000,
        total_risk: 1,
        risk_of_change: 2,
      },
    ],
    filters: {},
  };

  addFilter = (filterValue) => {
    this.setState((state) => {
      const filters = { ...state.filters };
      if (!filters.totalRiskFilter) {
        filters.totalRiskFilter = [];
      }
      if (!filters.totalRiskFilter.includes(filterValue)) {
        filters.totalRiskFilter.push(filterValue);
      }
      return { filters };
    });
  };

  render() {
    const {
      meta, data, shownData, filters,
    } = this.state;

    return (
      <>
        <Card>
          <CardBody>
            <Grid>
              <GridItem span={8}>
                <Title
                  headingLevel="h2"
                  size="3xl"
                >
                  {`Remote health detected ${meta.count} issues`}
                </Title>
                <p>Last checked: 4 minutes ago</p>
                <Popover
                  position="right"
                  headerContent="What is Remote health?"
                  bodyContent={(
                    <div>
                      It helps you identify, prioritize, and resolve risks to security,
                      performance, availability and stability before they become urgent issues
                    </div>
                  )}
                  aria-label="What is Remote health?"
                >
                  <Button style={{ margin: '0' }} variant="link">What is Remote health?</Button>
                </Popover>
              </GridItem>
              <GridItem span={4}>
                <Stack>
                  {
                    Object.entries(data.reduce(
                      (acc, cur) => {
                        const accTemp = { ...acc };
                        if (!accTemp[cur.total_risk]) {
                          accTemp[cur.total_risk] = 0;
                        }
                        accTemp[cur.total_risk] += 1;
                        return accTemp;
                      },
                      {},
                    ))
                      .map(([risk, count]) => (
                        <StackItem>
                          <Battery
                            label={severity[severityMapping[risk - 1]]}
                            severity={risk}
                            labelHidden
                          />
                          <Button
                            variant="link"
                            onClick={() => this.addFilter(severityMapping[risk - 1])}
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
        <Card>
          <CardBody>
            <RuleTable
              rules={{
                meta,
                data: shownData
              }}
              fetchData={({
                filterValues,
              }) => {
                this.setState((state) => {
                  const rules = state.data.filter((v) => {
                    let isFilter = true;
                    Object.entries(filterValues)
                      .forEach(([key, filter]) => {
                        console.log(filter, key);
                        console.log(severityMapping[v.total_risk - 1]);
                        if (key === 'totalRiskFilter') {
                          isFilter = filter.includes(severityMapping[v.total_risk - 1]);
                        }
                        if (key === 'descriptionFilter') {
                          isFilter = v.description.indexOf(filter) > -1 && isFilter;
                        }
                        console.log(isFilter);
                      });
                    return isFilter;
                  });
                  return {
                    shownData: rules,
                    filters: filterValues
                  };
                });
              }}
              filters={{
                descriptionFilter,
                totalRiskFilter,
              }}
              filterValues={filters}
              columns={[
                {
                  title: 'Description',
                  selector: 'description'
                },
                {
                  title: 'Added',
                  // eslint-disable-next-line react/prop-types
                  selector: ({ created_at: created }) => <DateFormat date={new Date(created)}/>,
                },
                {
                  title: 'Total risk',
                  selector:
                  // eslint-disable-next-line react/prop-types
                    ({ total_risk: riskNumber }) => (
                      <Battery
                        label={severity[severityMapping[riskNumber - 1]]}
                        severity={riskNumber}
                      />
                    ),
                },
              ]}
              detail={ruleData => (
                <ReportDetails
                  details={ruleData.details}
                  ruleId={ruleData.ruleId}
                  totalRisk={ruleData.total_risk}
                  riskOfChange={ruleData.risk_of_change}
                />
              )}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Insights;
