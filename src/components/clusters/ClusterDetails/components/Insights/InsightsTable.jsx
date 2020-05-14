/* eslint react/destructuring-assignment: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Card, CardBody, EmptyStateIcon,
} from '@patternfly/react-core';
import { cellWidth } from '@patternfly/react-table';
import {
  RuleTable,
  severity,
  descriptionFilter,
  totalRiskFilter,
  ruleStatusFilter,
  ReportDetails,
} from '@redhat-cloud-services/rule-components';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import { CheckCircleIcon } from '@patternfly/react-icons';
import AnalysisSummary from './AnalysisSummary';
import './index.css';
import { severityMapping } from './helpers';
import DisabledTooltip from './DisabledTooltip';

const dataSortMapping = {
  Description: (a, b) => a.description.localeCompare(b.description),
  Added: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  'Total risk': (a, b) => a.total_risk - b.total_risk,
};

const sortMultiplier = {
  asc: 1,
  desc: -1,
};

const isValueFiltered = (filterValues, v) => Object.entries(filterValues)
  .reduce(
    (acc, [key, filter]) => {
      let newAcc = true;

      switch (key) {
        case 'totalRiskFilter':
          if (filter.length > 0) {
            newAcc = filter.includes(severityMapping[v.total_risk - 1]);
          }
          break;
        case 'descriptionFilter':
          // Make all strings in lower case to avoid case sensitivity
          newAcc = v.description.toLowerCase().indexOf(filter.toLowerCase()) > -1;
          break;
        case 'ruleStatusFilter': {
          const showEnabled = filter === 'enabled' || filter === 'all';
          const showDisabled = filter === 'disabled' || filter === 'all';

          newAcc = v.disabled ? showDisabled : showEnabled;
          break;
        }
        default:
          break;
      }
      return newAcc && acc;
    },
    true,
  );

const defaultFilters = (filterValues, v) => {
  if (!('ruleStatusFilter' in filterValues)) {
    return !v.disabled;
  }

  return true;
};

const EmptyTableIcon = () => (
  <EmptyStateIcon className="success-color" icon={CheckCircleIcon} />
);

class InsightsTable extends React.Component {
  state = {
    shownData: [],
    filters: {},
    sortBy: {
      column: { title: 'Description' },
      direction: 'asc',
    },
    meta: {
      ...this.props.insightsData.meta,
      perPage: 10,
      page: 1,
    },
  };

  componentDidMount() {
    if (this.props.insightsData) {
      this.fetchData({ filterValues: this.state.filters });
    }
  }

  componentDidUpdate(prevProps) {
    const { insightsData } = this.props;
    if (insightsData && prevProps.insightsData !== insightsData) {
      this.fetchData({ filterValues: this.state.filters });
    }
  }

  onRuleDisabled() {
    if (!('ruleStatusFilter' in this.state.filters)) {
      this.setFilter('ruleStatusFilter', 'enabled');
    }
  }

  setFilter = (filterName, filterValue) => {
    this.setState(
      (state) => {
        const filters = { ...state.filters };
        filters[filterName] = filterValue;

        return {
          filters,
          meta: {
            ...state.meta,
            page: 1,
          },
        };
      },
      () => this.fetchData({ filterValues: this.state.filters }),
    );
  };

  addTotalRiskFilter = (filterValue) => {
    this.setState(
      (state) => {
        const filters = { ...state.filters };
        if (!filters.totalRiskFilter) {
          filters.totalRiskFilter = [];
        }
        if (!filters.totalRiskFilter.includes(filterValue)) {
          filters.totalRiskFilter.push(filterValue);
        }
        return {
          filters,
          meta: {
            ...state.meta,
            page: 1,
          },
        };
      },
      () => this.fetchData({ filterValues: this.state.filters }),
    );
  };

  fetchData = ({
    filterValues = this.state.filterValues,
    sortBy: sortByParam,
    meta = this.state.meta,
  }) => {
    this.setState((state) => {
      const { insightsData } = this.props;
      const sortBy = sortByParam && sortByParam.column ? sortByParam : state.sortBy;

      // Filter and sort data
      let rules = [...insightsData.data]
        .sort((a, b) => (sortBy && sortBy.column
          ? sortMultiplier[sortBy.direction] * dataSortMapping[sortBy.column.title](a, b)
          : 0))
        .filter(v => defaultFilters(filterValues, v))
        .filter(v => isValueFiltered(filterValues, v));

      // Total count of showed items
      const rulesLength = rules.length;

      // Pagination
      rules = rules.slice((meta.page - 1) * meta.perPage, meta.page * meta.perPage);

      return {
        shownData: rules,
        filters: filterValues,
        sortBy,
        meta: {
          ...meta,
          itemCount: rulesLength,
        },
      };
    });
  };

  render() {
    const {
      insightsData, voteOnRule, disableRule, enableRule,
    } = this.props;

    const {
      shownData,
      filters,
      meta,
      sortBy,
    } = this.state;

    return (
      <>
        <AnalysisSummary insightsData={insightsData} batteryClicked={this.addTotalRiskFilter} />
        <Card>
          <CardBody className="no-padding">
            <RuleTable
              rules={{
                meta,
                data: shownData,
              }}
              fetchData={this.fetchData}
              filters={{
                descriptionFilter,
                totalRiskFilter,
                ruleStatusFilter,
              }}
              filterValues={filters}
              sortBy={sortBy}
              columns={[
                {
                  title: 'Description',
                  selector: ({ description, disabled }) => (
                    <>
                      { disabled ? <DisabledTooltip /> : null }
                      { description }
                    </>
                  ),
                  transforms: [cellWidth(60)],
                },
                {
                  title: 'Added',
                  selector: ({ created_at: created }) => <DateFormat date={new Date(created)} />,
                },
                {
                  title: 'Total risk',
                  selector:
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
              detail={details => (
                <ReportDetails
                  createdAt={details.created_at}
                  details={details.details}
                  ruleId={details.rule_id}
                  totalRisk={details.total_risk}
                  riskOfChange={details.risk_of_change}
                  showRiskDescription={false}
                  definitions={details.extra_data}
                  remediating={
                    (details.reason || details.resolution)
                    && {
                      reason: details.reason,
                      resolution: details.resolution,
                    }
                  }
                  onFeedbackChanged={voteOnRule}
                />
              )}
              actionResolver={(rowData, { rowIndex }) => {
                // we gotta do this trick
                // since Patternfly considers row details as another row
                if (rowIndex % 2 !== 0) {
                  return null;
                }

                const realRowIndex = rowIndex / 2;

                if (typeof shownData[realRowIndex] === 'undefined') {
                  return null;
                }

                const { rule_id: ruleId, disabled } = shownData[realRowIndex];

                return [{
                  title: `${disabled ? 'Enable' : 'Disable'} health check`,
                  onClick: () => {
                    if (disabled) {
                      enableRule(ruleId);
                    } else {
                      disableRule(ruleId);
                      this.onRuleDisabled();
                    }
                  },
                }];
              }}
              emptyStateTitle="No health checks"
              emptyStateDescription={(
                <>
                  <p>Your cluster is not affected by enabled health checks.</p>
                  <Button
                    className="include-disabled-rules-link"
                    variant="link"
                    onClick={() => { this.setFilter('ruleStatusFilter', 'all'); }}
                  >
                    Include disabled health checks
                  </Button>
                </>
              )}
              emptyStateIcon={EmptyTableIcon}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

InsightsTable.propTypes = {
  insightsData: PropTypes.object.isRequired,
  voteOnRule: PropTypes.func.isRequired,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
};

export default InsightsTable;
