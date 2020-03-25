import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, PageSection } from '@patternfly/react-core';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';

import { viewPropsChanged, getQueryParam } from '../../../../../common/queryHelpers';
import ClusterLogsToolbar from './toolbar';
import LogTable from './LogTable';
import { viewConstants } from '../../../../../redux/constants';
import ErrorBox from '../../../../common/ErrorBox';
import ViewPaginationRow from '../../../common/ViewPaginationRow/viewPaginationRow';
import helpers from '../../../../../common/helpers';
import { SEVERITY_TYPES } from './clusterLogConstants';

class ClusterLogs extends React.Component {
  componentDidMount() {
    const { setListFlag } = this.props;

    const severityTypesFilter = getQueryParam('severityTypes') || '';
    if (!isEmpty(severityTypesFilter)) {
      setListFlag('conditionalFilterFlags', {
        severityTypes: severityTypesFilter.split(',').filter(type => SEVERITY_TYPES.includes(type)),
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const {
      viewOptions, clusterLogs: { pending },
    } = this.props;
    if (!pending && viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }
  }

  refresh() {
    const { externalClusterID, getClusterHistory, viewOptions } = this.props;
    getClusterHistory(externalClusterID, viewOptions);
  }

  render() {
    const {
      clusterLogs: {
        requestState: {
          error,
          pending,
          errorMessage,
          operationID,
        },
        logs,
      },
      viewOptions,
      history,
      setSorting,
      externalClusterID,
    } = this.props;
    if (error && !size(logs)) {
      return (
        <>
          <PageSection>
            <EmptyState>
              <ErrorBox
                message="Error retrieving cluster logs"
                response={{
                  errorMessage,
                  operationID,
                }}
              />
            </EmptyState>
          </PageSection>
        </>
      );
    }

    const hasNoFilters = isEmpty(viewOptions.filter)
      && helpers.nestedIsEmpty(viewOptions.flags.severityTypesFilter);
    const isPendingNoData = (!size(logs) && pending && hasNoFilters);

    return (
      <>
        <ClusterLogsToolbar
          view={viewConstants.CLUSTER_LOGS_VIEW}
          history={history}
          externalClusterID={externalClusterID}
          isPendingNoData={isPendingNoData}
        />
        <LogTable
          logs={logs}
          setSorting={setSorting}
        />

        <ViewPaginationRow
          viewType={viewConstants.CLUSTER_LOGS_VIEW}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
          variant="bottom"
          isDisabled={isPendingNoData}
        />
      </>
    );
  }
}

ClusterLogs.propTypes = {
  externalClusterID: PropTypes.string.isRequired,
  viewOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number,
    flags: PropTypes.shape({
      severityTypesFilter: PropTypes.object,
    }),
    filter: PropTypes.object,
  }).isRequired,
  clusterLogs: PropTypes.object.isRequired,
  getClusterHistory: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  setSorting: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClusterLogs;
