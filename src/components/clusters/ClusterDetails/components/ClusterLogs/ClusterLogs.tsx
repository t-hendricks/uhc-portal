import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateIcon,
  PageSection,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import size from 'lodash/size';
import React from 'react';
import { useHistory } from 'react-router';

import { useDispatch } from 'react-redux';
import { viewActions } from '~/redux/actions/viewOptionsActions';
import { useGlobalState } from '~/redux/hooks';
import { ViewSorting } from '~/types/types';

import LogTable from './LogTable';
import ClusterLogsToolbar from './toolbar';
import helpers from '../../../../../common/helpers';
import {
  buildFilterURLParams,
  getQueryParam,
  viewPropsChanged,
} from '../../../../../common/queryHelpers';
import { viewConstants } from '../../../../../redux/constants';
import ErrorBox from '../../../../common/ErrorBox';
import LiveDateFormat from '../../../../common/LiveDateFormat/LiveDateFormat';
import ViewPaginationRow from '../../../common/ViewPaginationRow/viewPaginationRow';
import { clusterLogActions } from './clusterLogActions';
import { LOG_TYPES, SEVERITY_TYPES } from './clusterLogConstants';
import {
  dateFormat,
  dateParse,
  getTimestampFrom,
  onDateChangeFromFilter,
} from './toolbar/ClusterLogsDatePicker';

type ClusterLogsProps = {
  refreshEvent: {
    type: string;
    reset: () => void;
  };
  clusterID?: string;
  externalClusterID?: string;
  createdAt?: string;
  isVisible?: boolean;
};

const ClusterLogs = ({
  externalClusterID,
  clusterID,
  createdAt,
  refreshEvent,
  isVisible,
}: ClusterLogsProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const viewType = viewConstants.CLUSTER_LOGS_VIEW;

  const { requestState, fetchedClusterLogsAt, logs } = useGlobalState((state) => state.clusterLogs);
  const viewOptions = useGlobalState((state) => state.viewOptions[viewType]);

  const [hasChanged, setHasChanged] = React.useState(false);
  const [previousViewOptions, setPreviousViewOptions] = React.useState(viewOptions);
  const [ignoreErrors, setIgnoreErrors] = React.useState(false);
  const [isPendingNoData, setIsPendingNoData] = React.useState(false);

  React.useEffect(() => {
    const severityTypes = getQueryParam('severityTypes') || '';
    const logTypes = getQueryParam('logTypes') || '';
    if (!isEmpty(severityTypes) || !isEmpty(logTypes)) {
      setHasChanged(true);
      dispatch(
        viewActions.onListFlagsSet(
          'conditionalFilterFlags',
          {
            severityTypes: !isEmpty(severityTypes)
              ? severityTypes.split(',').filter((type) => SEVERITY_TYPES.includes(type))
              : [],
            logTypes: !isEmpty(logTypes)
              ? logTypes.split(',').filter((type) => LOG_TYPES.includes(type))
              : [],
          },
          viewType,
        ),
      );
    }
  }, [dispatch, viewType]);

  React.useEffect(() => {
    if (createdAt) {
      // Apply a timestamp filter by default
      const minDate = dateParse(createdAt);
      const { symbol, date } = onDateChangeFromFilter(dateFormat(getTimestampFrom(minDate)));
      const filterObject = {
        ...(viewOptions.filter as object),
        timestampFrom: `${symbol} '${date}'`,
      };

      if (!isEqual(filterObject, viewOptions.filter)) {
        setHasChanged(true);
        dispatch(viewActions.onListFilterSet(filterObject, viewType));
      }
    }
  }, [createdAt, viewOptions.filter, dispatch, viewType]);

  React.useEffect(() => {
    if (
      viewPropsChanged(viewOptions, previousViewOptions) &&
      (!requestState.pending || (!hasChanged && (externalClusterID || clusterID)))
    ) {
      dispatch(clusterLogActions.getClusterHistory(externalClusterID, clusterID, viewOptions));
    }
    setPreviousViewOptions(viewOptions);
  }, [
    dispatch,
    previousViewOptions,
    requestState.pending,
    hasChanged,
    externalClusterID,
    clusterID,
    setPreviousViewOptions,
    viewOptions,
  ]);

  React.useEffect(() => {
    // These errors are present during cluster install
    // Instead of showing an error, display "No cluster log entries found"
    if (requestState.error) {
      setIgnoreErrors([403, 404].includes(requestState.errorCode!));
    }
  }, [requestState]);

  React.useEffect(() => {
    const hasNoFilters = isEmpty(viewOptions.filter) && helpers.nestedIsEmpty(viewOptions.flags);
    setIsPendingNoData(!size(logs) && requestState.pending && hasNoFilters);
  }, [logs, requestState.pending, viewOptions.filter, viewOptions.flags]);

  React.useEffect(() => {
    if (isVisible === true) {
      history.push({
        ...history.location,
        search: buildFilterURLParams(viewOptions.flags.conditionalFilterFlags || {}),
      });
    }
  }, [isVisible, viewOptions.flags.conditionalFilterFlags, history]);

  return (
    <Card className="ocm-c-overview-cluster-history__card">
      <CardHeader className="ocm-c-overview-cluster-history__card--header">
        <CardTitle className="ocm-c-overview-cluster-history__card--header">
          <Title headingLevel="h2" className="card-title" data-testid="cluster_history_title">
            Cluster history
          </Title>
        </CardTitle>
        <CardActions>
          Updated &nbsp;
          {fetchedClusterLogsAt && <LiveDateFormat timestamp={fetchedClusterLogsAt.getTime()} />}
        </CardActions>
      </CardHeader>
      <CardBody className="ocm-c-overview-cluster-history__card--body">
        {requestState.error && !ignoreErrors && (
          <ErrorBox
            message="Error retrieving cluster logs"
            response={{
              errorMessage: requestState.errorMessage,
              operationID: requestState.operationID,
            }}
          />
        )}
        <ClusterLogsToolbar
          view={viewType}
          history={history}
          externalClusterID={externalClusterID}
          isPendingNoData={isPendingNoData}
          clusterID={clusterID}
        />
        {requestState.error && !size(logs) && ignoreErrors ? (
          <>
            <PageSection>
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title size="lg" headingLevel="h4">
                  No cluster log entries found
                </Title>
              </EmptyState>
            </PageSection>
          </>
        ) : (
          <>
            <LogTable
              pending={requestState.pending}
              logs={logs}
              setSorting={(sorting: ViewSorting) =>
                dispatch(viewActions.onListSortBy(sorting, viewType))
              }
              refreshEvent={refreshEvent}
            />
            <ViewPaginationRow
              viewType={viewType}
              currentPage={viewOptions.currentPage}
              pageSize={viewOptions.pageSize}
              totalCount={viewOptions.totalCount}
              totalPages={viewOptions.totalPages}
              variant="bottom"
              isDisabled={isPendingNoData}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ClusterLogs;
