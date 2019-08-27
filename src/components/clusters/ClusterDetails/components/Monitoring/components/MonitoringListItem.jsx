import React from 'react';
import PropTypes from 'prop-types';
import {
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';

import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';

function MonitoringListItem({
  title = '', numOfIssues = null, expanded, toggle, children,
}) {
  const id = title.replace(/\s+/g, '-').toLowerCase();

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
            <DataListCell key={id}>
              <Split>
                <SplitItem isFilled>
                  <Title headingLevel="h4" size="2xl">{title}</Title>
                </SplitItem>
                <SplitItem>
                  {numOfIssues !== null && (
                  <React.Fragment>
                    { numOfIssues === 0
                      ? <CheckCircleIcon className="status-icon" color={global_success_color_100.value} size="md" />
                      : <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />
                      }
                    <span>
                      {numOfIssues}
                      {' '}
                        discovered issues
                    </span>
                  </React.Fragment>)}
                </SplitItem>
              </Split>
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
    </DataListItem>);
}

MonitoringListItem.propTypes = {
  title: PropTypes.string,
  numOfIssues: PropTypes.number,
  expanded: PropTypes.array,
  toggle: PropTypes.func,
  children: PropTypes.node,
};

MonitoringListItem.defaultProps = {
  expanded: [],
};

export default MonitoringListItem;
