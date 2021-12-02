/* eslint react/destructuring-assignment: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Card, CardBody, EmptyStateIcon, Label, Stack, StackItem,
} from '@patternfly/react-core';
import { cellWidth, RowWrapper } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import RuleTable from '@redhat-cloud-services/rule-components/RuleTable/RuleTable';
import ReportDetails from '@redhat-cloud-services/rule-components/ReportDetails';
import {
  descriptionFilter,
  totalRiskFilter,
  ruleStatusFilter,
} from '@redhat-cloud-services/rule-components/RuleFilters';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { InsightsLabel } from '@redhat-cloud-services/frontend-components/InsightsLabel';
import { CheckCircleIcon } from '@patternfly/react-icons';
import AnalysisSummary from './AnalysisSummary';
import { severityMapping, appendCrParamToDocLinks } from './helpers';
import { setReportDetails } from './InsightsActions';
import OnRuleDisableFeedbackModal from './OnRuleDisableFeedbackModal';
import { labelBorderColor } from './InsightsSelectors';
import { INSIGHTS_RULE_CATEGORIES } from './InsightsConstants';

const dataSortMapping = {
  Description: (a, b) => a.description.localeCompare(b.description),
  Added: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  'Total risk': (a, b) => a.total_risk - b.total_risk,
};

const sortMultiplier = {
  asc: 1,
  desc: -1,
};

const groupsFilter = groups => ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Category',
  value: 'category',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: groups // groups holds an array of { title: string, tags: string[] }-like objects
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(groupValues => ({
        label: groupValues.title,
        textual: groupValues.title,
        value: groupValues.tags.join(','),
      })),
  },
});

const isValueFiltered = (filterValues, value) => Object.entries(filterValues)
  .reduce(
    (acc, [key, filter]) => {
      let newAcc = true;

      switch (key) {
        case 'totalRiskFilter':
          if (filter.length > 0) {
            newAcc = filter.includes(severityMapping[value.total_risk - 1]);
          }
          break;
        case 'descriptionFilter':
          // Make all strings in lower case to avoid case sensitivity
          newAcc = value.description.toLowerCase().indexOf(filter.toLowerCase()) > -1;
          break;
        case 'ruleStatusFilter': {
          const showEnabled = filter === 'enabled' || filter === 'all';
          const showDisabled = filter === 'disabled' || filter === 'all';

          newAcc = value.disabled ? showDisabled : showEnabled;
          break;
        }
        case 'groupsFilter': {
          if (filter.length > 0) {
            const flattenFilter = new Set(filter.map(val => val.split(',')).flat());
            newAcc = value.tags.filter(x => flattenFilter.has(x)).length > 0;
          }
          break;
        }
        default:
          break;
      }
      return newAcc && acc;
    },
    true,
  );

const EmptyTableIcon = () => (
  <EmptyStateIcon className="success-color" icon={CheckCircleIcon} />
);

class InsightsTable extends React.Component {
  state = {
    shownData: [],
    filters: { ruleStatusFilter: 'enabled' },
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
    const { insightsData, addNotificationToaster } = this.props;
    if (insightsData && prevProps.insightsData !== insightsData) {
      this.fetchData({ filterValues: this.state.filters });
      addNotificationToaster({
        title: 'Recommendation bla bla bla',
        description: 'WAHAHA',
        variant: 'success',
        dismissable: true,
      });
    }
  }

  onRuleDisable(ruleId, errorKey) {
    const {
      openModal,
      cluster,
    } = this.props;
    const isManagedCluster = cluster?.subscription?.managed || false;
    const clusterId = cluster?.external_id || '';
    openModal('insights-on-rule-disable-feedback-modal', {
      clusterId, ruleId, errorKey, isRuleDetailsPage: false, isManagedCluster,
    });
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

  addGroupsFilter = (filterValue) => {
    this.setState(
      (state) => {
        const filters = { ...state.filters };
        if (!filters.groupsFilter) {
          filters.groupsFilter = [];
        }
        if (!filters.groupsFilter.includes(filterValue)) {
          filters.groupsFilter.push(filterValue);
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
      const data = insightsData.data || [];

      // Filter and sort data
      let rules = [...data]
        .sort((a, b) => (sortBy && sortBy.column
          ? sortMultiplier[sortBy.direction] * dataSortMapping[sortBy.column.title](a, b)
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
    const {
      insightsData,
      enableRule,
      cluster,
    } = this.props;

    const {
      shownData,
      filters,
      meta,
      sortBy,
    } = this.state;

    function getShownDataForRow(rowIndex) {
      if (rowIndex % 2 !== 0) {
        return null;
      }

      const realRowIndex = rowIndex / 2;

      if (typeof shownData[realRowIndex] === 'undefined') {
        return null;
      }

      return shownData[realRowIndex];
    }

    const customRowWrapper = ({ ...props }) => (
      /* eslint-disable-next-line camelcase */
      <RowWrapper {...props} ouiaId={getShownDataForRow(props.rowProps.rowIndex)?.rule_id} />
    );

    return (
      <div id="cluster-insights-table">
        <AnalysisSummary
          groups={INSIGHTS_RULE_CATEGORIES}
          insightsData={insightsData}
          batteryClicked={this.addTotalRiskFilter}
          groupClicked={this.addGroupsFilter}
        />
        <Card>
          <CardBody className="no-padding">
            <RuleTable
              ouiaId="rules"
              toolbarProps={{ ouiaId: 'rulesToolbar' }}
              rowWrapper={customRowWrapper}
              rules={{
                meta,
                data: shownData,
              }}
              fetchData={this.fetchData}
              filters={{
                descriptionFilter,
                totalRiskFilter,
                ruleStatusFilter,
                groupsFilter: groupsFilter(INSIGHTS_RULE_CATEGORIES),
              }}
              filterValues={filters}
              sortBy={sortBy}
              columns={[
                {
                  title: 'Description',
                  selector: report => (
                    <>
                      {report.disabled ? <Label className="disabled-tooltip">Disabled</Label> : null}
                      <Link
                        to={`/details/s/${cluster.subscription.id}/insights/${report.rule_id.replace(/\./g, '|')}/${report.extra_data.error_key}`}
                        onClick={() => setReportDetails(report)}
                      >
                        {report.description}
                      </Link>
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
                        <InsightsLabel
                          value={riskNumber}
                          rest={{ variant: 'outline', color: labelBorderColor[riskNumber] }}
                        />
                      </div>
                    ),
                },
              ]}
              detail={details => (
                <Stack className="report-details-unfolded">
                  <StackItem>
                    <ReportDetails
                      details={appendCrParamToDocLinks(details.details)}
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
                    />
                  </StackItem>
                  <StackItem className="report-details-unfolded__link">
                    <Link
                      to={`/details/s/${cluster.subscription.id}/insights/${details.rule_id.replace(/\./g, '|')}/${details.extra_data.error_key}`}
                      onClick={() => setReportDetails(details)}
                    >
                      View details and remediation steps
                    </Link>
                  </StackItem>
                </Stack>
              )}
              actionResolver={(rowData, { rowIndex }) => {
                const shownDataForRow = getShownDataForRow(rowIndex);

                if (shownDataForRow === null) {
                  return null;
                }

                const { rule_id: ruleId, disabled } = shownDataForRow;
                const errorKey = shownDataForRow.extra_data.error_key;

                return [{
                  title: `${disabled ? 'Enable' : 'Disable'} recommendation`,
                  onClick: () => {
                    if (disabled) {
                      enableRule(ruleId, errorKey);
                    } else {
                      this.onRuleDisable(ruleId, errorKey);
                    }
                  },
                }];
              }}
              emptyStateTitle="No recommendations"
              emptyStateDescription={(
                <>
                  <p>Your cluster is not affected by enabled recommendations.</p>
                  <Button
                    className="include-disabled-rules-link"
                    variant="link"
                    onClick={() => { this.setFilter('ruleStatusFilter', 'all'); }}
                  >
                    Include disabled recommendations
                  </Button>
                </>
              )}
              emptyStateIcon={EmptyTableIcon}
            />
            <OnRuleDisableFeedbackModal />
          </CardBody>
        </Card>
      </div>
    );
  }
}

InsightsTable.propTypes = {
  cluster: PropTypes.shape({
    external_id: PropTypes.string,
    subscription: PropTypes.shape({
      id: PropTypes.string,
      managed: PropTypes.bool,
    }),
  }),
  insightsData: PropTypes.object.isRequired,
  enableRule: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  addNotificationToaster: PropTypes.func.isRequired,
};

export default InsightsTable;
