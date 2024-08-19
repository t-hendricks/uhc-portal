import React from 'react';
// import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import { useDispatch } from 'react-redux';

// import { useNavigate } from 'react-router-dom-v5-compat';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  PageSection,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

import {
  // invalidateClusterLogsQueries,
  useFetchClusterLogs,
} from '~/queries/ClusterLogsQueries/useFetchClusterLogs';
import { viewActions } from '~/redux/actions/viewOptionsActions';
import { ClusterLog } from '~/types/service_logs.v1';
import { ViewSorting } from '~/types/types';

// import helpers from '../../../../../common/helpers';
// import {
//   buildFilterURLParams,
//   getQueryParam,
//   viewPropsChanged,
// } from '../../../../../common/queryHelpers';
import { viewConstants } from '../../../../../redux/constants';
import ErrorBox from '../../../../common/ErrorBox';
import LiveDateFormat from '../../../../common/LiveDateFormat/LiveDateFormat';
import ViewPaginationRow from '../../../common/ViewPaginationRow/viewPaginationRow';

// import {
//   dateFormat,
//   dateParse,
//   getTimestampFrom,
//   onDateChangeFromFilter,
// } from './toolbar/ClusterLogsDatePicker';
import { ClusterLogsErrorType, initialParams } from './cluserLogsHelper';
// import { LOG_TYPES, SEVERITY_TYPES } from './clusterLogConstants';
import LogTable from './LogTable';
// import ClusterLogsToolbar from './toolbar';

type ClusterLogsProps = {
  refreshEvent: {
    type: string;
    reset: () => void;
  };
  clusterID?: string;
  externalClusterID?: string;
  region?: string | undefined;
  createdAt?: string;
  isVisible?: boolean;
  findGcpOrgPolicyWarning?: (logs?: ClusterLog[]) => void;
};

const ClusterLogs = ({
  externalClusterID,
  clusterID,
  region,
  createdAt,
  refreshEvent,
  isVisible,
  findGcpOrgPolicyWarning,
}: ClusterLogsProps) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewType = viewConstants.CLUSTER_LOGS_VIEW;
  // const [hasChanged, setHasChanged] = React.useState(false);
  const [ignoreErrors, setIgnoreErrors] = React.useState(false);
  const [isPendingNoData, setIsPendingNoData] = React.useState(false);
  const initialView = Object.assign(initialParams);

  const {
    data: logsData,
    isError,
    error: clusterLogsError,
    dataUpdatedAt,
    isPending,
  } = useFetchClusterLogs(externalClusterID, clusterID, initialView, region);

  // placeholder OCMUI-1842
  const viewOptions = {
    currentPage: logsData?.page,
    pageSize: logsData?.size,
    totalCount: logsData?.total,
  };

  const logs = logsData?.items;
  const error = clusterLogsError as ClusterLogsErrorType;
  const fetchedClusterLogsAt = new Date(dataUpdatedAt);

  // TODO OCMUI OCMUI-1842
  // React.useEffect(() => {
  //   const severityTypes = getQueryParam('severityTypes') || '';
  //   const logTypes = getQueryParam('logTypes') || '';
  //   if (!isEmpty(severityTypes) || !isEmpty(logTypes)) {
  //     setHasChanged(true);
  //     dispatch(
  //       viewActions.onListFlagsSet(
  //         'conditionalFilterFlags',
  //         {
  //           severityTypes: !isEmpty(severityTypes)
  //             ? severityTypes.split(',').filter((type) => SEVERITY_TYPES.includes(type))
  //             : [],
  //           logTypes: !isEmpty(logTypes)
  //             ? logTypes.split(',').filter((type) => LOG_TYPES.includes(type))
  //             : [],
  //         },
  //         viewType,
  //       ),
  //     );
  //   }

  //   let filter;

  //   const loggedBy = getQueryParam('loggedBy') || '';
  //   const description = getQueryParam('description') || '';
  //   const timestampFrom = getQueryParam('timestampFrom') || '';
  //   const timestampTo = getQueryParam('timestampTo') || '';
  //   if (
  //     !isEmpty(loggedBy) ||
  //     !isEmpty(description) ||
  //     !isEmpty(timestampFrom) ||
  //     !isEmpty(timestampTo)
  //   ) {
  //     filter = { loggedBy, description, timestampFrom, timestampTo };
  //   }

  //   if (createdAt && !isEmpty(timestampFrom)) {
  //     // Apply a timestamp filter by default
  //     const minDate = dateParse(createdAt);
  //     const { symbol, date } = onDateChangeFromFilter(dateFormat(getTimestampFrom(minDate)));
  //     filter = {
  //       ...(filter ?? {}),
  //       timestampFrom: `${symbol} '${date}'`,
  //     };
  //   }

  //   if (filter) {
  //     setHasChanged(true);
  //     dispatch(viewActions.onListFilterSet(filter, viewType));
  //   }
  // }, [createdAt, dispatch, viewType]);

  // React.useEffect(() => {
  //   if (
  //     viewPropsChanged(viewOptions, previousViewOptions) &&
  //     (!isPending || (!hasChanged && (externalClusterID || clusterID)))
  //   ) {
  //     invalidateClusterLogsQueries();
  //     setPreviousViewOptions(viewOptions);
  //   }
  // }, [
  //   dispatch,
  //   previousViewOptions,
  //   isPending,
  //   hasChanged,
  //   externalClusterID,
  //   clusterID,
  //   setPreviousViewOptions,
  //   viewOptions,
  // ]);

  React.useEffect(() => {
    // These errors are present during cluster install
    // Instead of showing an error, display "No cluster log entries found"
    if (error) {
      if (error?.errorCode === 403 || error?.errorCode === 404) setIgnoreErrors(true);
    }
  }, [error]);

  React.useEffect(() => {
    setIsPendingNoData(!size(logs) && isPending);
  }, [logs, isPending]);

  // TODO OCMUI OCMUI-1842
  // React.useEffect(() => {
  //   if (isVisible === true) {
  //     const filters: {
  //       [flag: string]: string[];
  //     } = Object.entries(viewOptions.filter)
  //       .filter(
  //         (e) => ['description', 'loggedBy', 'timestampFrom', 'timestampTo'].includes(e[0]) && e[1],
  //       )
  //       .reduce((acc, curr) => ({ ...acc, [`${curr[0]}`]: [curr[1]] }), {});
  //     navigate(
  //       {
  //         hash: '#clusterHistory',
  //         search: buildFilterURLParams({
  //           ...filters,
  //           ...(viewOptions.flags.conditionalFilterFlags || {}),
  //         }),
  //       },
  //       { replace: true },
  //     );
  //   }
  // }, [isVisible, viewOptions.flags.conditionalFilterFlags, viewOptions.filter, navigate]);

  React.useEffect(() => {
    if (findGcpOrgPolicyWarning) {
      findGcpOrgPolicyWarning(logs);
    }
  }, [logs, findGcpOrgPolicyWarning]);

  return (
    <Card className="ocm-c-overview-cluster-history__card">
      <CardHeader
        actions={{
          actions: (
            <>
              Updated &nbsp;
              {fetchedClusterLogsAt && (
                <LiveDateFormat timestamp={fetchedClusterLogsAt.getTime()} />
              )}
            </>
          ),
          hasNoOffset: false,
        }}
        className="ocm-c-overview-cluster-history__card--header"
      >
        <CardTitle className="ocm-c-overview-cluster-history__card--header">
          <Title headingLevel="h2" className="card-title" data-testid="cluster_history_title">
            Cluster history
          </Title>
        </CardTitle>
      </CardHeader>
      <CardBody className="ocm-c-overview-cluster-history__card--body">
        {isError && !ignoreErrors && (
          <ErrorBox
            message="Error retrieving cluster logs"
            response={{
              errorMessage: error.errorMessage,
              operationID: error.operationID,
            }}
          />
        )}
        {/* TODO OCMUI-1842
        <ClusterLogsToolbar
          view={viewType}
          externalClusterID={externalClusterID}
          isPendingNoData={isPendingNoData}
          clusterID={clusterID}
          logs={logs?.length}
        /> */}
        {isError && !size(logs) && ignoreErrors ? (
          <PageSection>
            <EmptyState>
              <EmptyStateHeader
                titleText="No cluster log entries found"
                icon={<EmptyStateIcon icon={SearchIcon} />}
                headingLevel="h4"
              />
            </EmptyState>
          </PageSection>
        ) : (
          <>
            <LogTable
              pending={isPending}
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
