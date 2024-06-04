import React from 'react';
import PropTypes from 'prop-types';

import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

function MonitoringListItem({
  title = '',
  numOfIssues = null,
  numOfWarnings = null,
  toggle,
  expanded,
  hasData,
  children,
}) {
  const id = title.replace(/\s+/g, '-').toLowerCase();

  const getSummary = () => {
    // no metrics
    if (!hasData) {
      return (
        <>
          <ExclamationTriangleIcon className="status-icon warning" />
          <span>Metrics not available</span>
        </>
      );
    }

    // discovered issues summary
    if (numOfIssues > 0) {
      return (
        <>
          <ExclamationCircleIcon className="status-icon danger" />
          <span>
            {numOfIssues} discovered {numOfIssues === 1 ? 'issue' : 'issues'}
          </span>
        </>
      );
    }

    // warnings summary
    if (numOfWarnings > 0) {
      return (
        <>
          <ExclamationTriangleIcon className="status-icon warning" />
          <span>
            {numOfWarnings} {numOfWarnings === 1 ? 'warning' : 'warnings'}
          </span>
        </>
      );
    }

    // no issues
    return (
      <>
        <CheckCircleIcon className="status-icon success" />
        <span>{numOfIssues} discovered issues</span>
      </>
    );
  };

  return (
    <DataListItem aria-labelledby={id} isExpanded={expanded.includes(id)}>
      <DataListItemRow>
        <DataListToggle
          onClick={() => toggle(id)}
          isExpanded={expanded.includes(id)}
          id={`${id}-toggle`}
          aria-controls={`${id}-toggle-expand`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`title-${id}`}>
              <Title headingLevel="h4" className="item-title">
                {title}
              </Title>
            </DataListCell>,
            <DataListCell key={`summary-${id}`} className="item-summary">
              {getSummary()}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label="Primary Content Details"
        id={`${id}-expand`}
        isHidden={!expanded.includes(id)}
      >
        {children}
      </DataListContent>
    </DataListItem>
  );
}

MonitoringListItem.propTypes = {
  title: PropTypes.string,
  numOfIssues: PropTypes.number,
  numOfWarnings: PropTypes.number,
  expanded: PropTypes.array,
  toggle: PropTypes.func,
  children: PropTypes.node,
  hasData: PropTypes.bool,
};

MonitoringListItem.defaultProps = {
  expanded: [],
};

export default MonitoringListItem;
