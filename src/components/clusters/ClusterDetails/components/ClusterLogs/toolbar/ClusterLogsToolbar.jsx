import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { viewConstants } from '../../../../../../redux/constants';
import ClusterLogsFilterChipGroup from './ClusterLogsFilterChipGroup';
import ClusterLogsDownload from './ClusterLogsDownload';
import ClusterLogsConditionalFilter from './ClusterLogsConditionalFilter';
import ClusterLogsDatePicker from './ClusterLogsDatePicker';
import ViewPaginationRow from '../../../../common/ViewPaginationRow/viewPaginationRow';

class ClusterLogsToolbar extends React.PureComponent {
  render() {
    const {
      viewOptions,
      history,
      setFlags,
      setFilter,
      externalClusterID,
      currentFilter,
      currentFlags,
      clearFiltersAndFlags,
      isPendingNoData,
      createdAt,
      clusterID,
    } = this.props;

    return (
      <>
        <Toolbar className="cluster-log__toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ClusterLogsDatePicker
                currentFilter={currentFilter}
                currentFlags={currentFlags}
                setFilter={setFilter}
                setFlags={setFlags}
                createdAt={createdAt}
              />
            </ToolbarGroup>
            <ToolbarItem>
              <ClusterLogsConditionalFilter
                view={viewConstants.CLUSTER_LOGS_VIEW}
                history={history}
                currentFilter={currentFilter}
                currentFlags={currentFlags}
                setFilter={setFilter}
                setFlags={setFlags}
              />
            </ToolbarItem>
            <ToolbarItem>
              <ClusterLogsDownload
                externalClusterID={externalClusterID}
                clusterID={clusterID}
                viewOptions={viewOptions}
              />
            </ToolbarItem>
            <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
              <ViewPaginationRow
                viewType={viewConstants.CLUSTER_LOGS_VIEW}
                currentPage={viewOptions.currentPage}
                pageSize={viewOptions.pageSize}
                totalCount={viewOptions.totalCount}
                totalPages={viewOptions.totalPages}
                variant="top"
                isDisabled={isPendingNoData}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <ClusterLogsFilterChipGroup
          view={viewConstants.CLUSTER_LOGS_VIEW}
          history={history}
          currentFilter={currentFilter}
          currentFlags={currentFlags}
          setFilter={setFilter}
          setFlags={setFlags}
          clearFiltersAndFlags={clearFiltersAndFlags}
        />
      </>
    );
  }
}

ClusterLogsToolbar.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    description: PropTypes.string,
    timestampFrom: PropTypes.string,
    timestampTo: PropTypes.string,
  }).isRequired,
  setFlags: PropTypes.func.isRequired,
  currentFlags: PropTypes.shape({
    severityTypes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  clearFiltersAndFlags: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  externalClusterID: PropTypes.string.isRequired,
  viewOptions: PropTypes.object.isRequired,
  isPendingNoData: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  clusterID: PropTypes.string.isRequired,
};

export default ClusterLogsToolbar;
