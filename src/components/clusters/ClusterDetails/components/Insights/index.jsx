import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Title, Button,
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
import { RemoteHealthPopover, NoIssuesMessage } from './EmptyTableMessage';

const severityMapping = Object.keys(severity);
const dataSortMapping = {
  Description: (a, b) => a.description.localeCompare(b.description),
  Added: (a, b) => a.created_at - b.created_at,
  'Total risk': (a, b) => a.total_risk - b.total_risk,
};

const groupRulesByRisk = data => data.reduce(
  (acc, cur) => {
    const accTemp = { ...acc };
    const { total_risk: totalRisk } = cur;
    if (!accTemp[totalRisk]) {
      accTemp[totalRisk] = 0;
    }
    accTemp[totalRisk] += 1;
    return accTemp;
  },
  {},
);

const isValueFiltered = (filterValues, v) => Object.entries(filterValues)
  .reduce((acc, [key, filter]) => {
      let newAcc = true;
      switch (key) {
        case 'totalRiskFilter':
          if (filter.length > 0) {
            newAcc = filter.includes(severityMapping[v.total_risk - 1]);
          }
          break;
        case 'descriptionFilter':
          newAcc = v.description.indexOf(filter) > -1;
          break;
        default:
          break;
      }
      return newAcc && acc;
    },
    true);

class InsightsTable extends React.Component {
  state = {
    shownData: [],
    filters: {},
    sortBy: {
      column: { title: 'Description' },
      direction: 'asc',
    },
    meta: {
      ...this.props.insights.meta,
      perPage: 10,
      page: 1
    },
  };

  componentDidMount() {
    if (this.props.insights) {
      this.fetchData({ filterValues: this.state.filters });
    }
  }

  componentDidUpdate(prevProps) {
    const { insights } = this.props;
    if (insights && prevProps.insights !== insights) {
      this.fetchData({ filterValues: this.state.filters });
    }
  }

  addFilter = (filterValue) => {
    this.setState(
      (state) => {
        const filters = { ...state.filters };
        if (!filters.totalRiskFilter) {
          filters.totalRiskFilter = [];
        }
        if (!filters.totalRiskFilter.includes(filterValue)) {
          filters.totalRiskFilter.push(filterValue);
        }
        return { filters };
      },
      () => this.fetchData({ filterValues: this.state.filters }),
    );
  };

  fetchData = ({
    filterValues = this.state.filterValues,
    sortBy = this.state.sortBy,
    meta = this.state.meta,
  }) => {
    const { insights } = this.props;

    // Filter and sort data
    let rules = insights.data
      .filter(v => isValueFiltered(filterValues, v))
      .sort((a, b) => (sortBy && sortBy.column
        ? dataSortMapping[sortBy.column.title](a, b)
        : 0));

    // Total count of showed items
    const rulesLength = rules.length;

    // Pagination
    rules = rules.slice((meta.page - 1) * meta.perPage, meta.page * meta.perPage);

    this.setState({
      shownData: rules,
      filters: filterValues,
      sortBy,
      meta: {
        ...meta,
        itemCount: rulesLength
      },
    });
  };

  render() {
    const { insights } = this.props;
    const {
      shownData,
      filters,
      meta,
    } = this.state;
    return (
      <>
        <Card>
          <CardBody>
            <Grid>
              <GridItem span={9} className="health-description">
                <Title headingLevel="h2"
                       size="3xl">{`Remote health detected ${insights.meta.count} issues`}</Title>
                <p>Last checked: 4 minutes ago</p>
                <RemoteHealthPopover/>
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
          <CardBody className="no-padding">
            <RuleTable
              rules={{
                meta,
                data: shownData
              }}
              fetchData={this.fetchData}
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
                      <div className="battery">
                        <Battery
                          label={severity[severityMapping[riskNumber - 1]]}
                          severity={riskNumber}
                        />
                      </div>
                    ),
                },
              ]}
              detail={ruleData => (
                <ReportDetails
                  createdAt={ruleData.created_at}
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

InsightsTable.propTypes = {
  insights: PropTypes.object.isRequired,
};

const Insights = ({ insights }) => {
  if (!insights || insights.meta.count === 0) {
    return <NoIssuesMessage/>;
  }
  return <InsightsTable insights={insights}/>;
};

Insights.propTypes = {
  insights: PropTypes.object,
};

Insights.defaultProps = {
  insights: {
    meta: { count: 0 },
    data: []
  },
};

export default Insights;
