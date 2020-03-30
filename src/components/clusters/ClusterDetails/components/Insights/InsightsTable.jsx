/* eslint react/destructuring-assignment: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import {
  RuleTable,
  severity,
  ReportDetails,
  descriptionFilter,
  totalRiskFilter,
} from '@redhat-cloud-services/rule-components';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import AnalysisSummary from './AnalysisSummary';
import './index.css';
import { severityMapping } from './helpers';

const dataSortMapping = {
  Description: (a, b) => a.description.localeCompare(b.description),
  Added: (a, b) => a.created_at - b.created_at,
  'Total risk': (a, b) => a.total_risk - b.total_risk,
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
          newAcc = v.description.indexOf(filter) > -1;
          break;
        default:
          break;
      }
      return newAcc && acc;
    },
    true,
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
          ? dataSortMapping[sortBy.column.title](a, b)
          : 0))
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
    const { insightsData, voteOnRule } = this.props;
    const {
      shownData,
      filters,
      meta,
    } = this.state;
    return (
      <>
        <AnalysisSummary insightsData={insightsData} batteryClicked={this.addFilter} />
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
              }}
              filterValues={filters}
              columns={[
                {
                  title: 'Description',
                  selector: 'description',
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
                  riskOfChange={details.risk_of_change + 1}
                  onFeedbackChanged={voteOnRule}
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
  insightsData: PropTypes.object.isRequired,
  voteOnRule: PropTypes.func.isRequired,
};

export default InsightsTable;
