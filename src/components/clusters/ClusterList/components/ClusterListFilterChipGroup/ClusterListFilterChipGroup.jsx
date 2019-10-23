import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Chip, ChipGroup, ChipGroupToolbarItem, Button, Split, SplitItem,
} from '@patternfly/react-core';

function ClusterListFilterChipGroup({ currentFilter, setFilter }) {
  if (isEmpty(currentFilter)) {
    return null;
  }

  const filterLabels = {
    Ok: 'Subscribed',
    NotSet: 'Not Subscribed',
    Overcommitted: 'Insufficient',
    InconsistentServices: 'Invalid',
    NotReconciled: 'Unknown',
  };


  return (
    <Split>
      <SplitItem>
        <ChipGroup withToolbar>
          <ChipGroupToolbarItem key="Subscription status" categoryName="Subscription status">
            {currentFilter.map((key) => {
              const label = filterLabels[key];
              const deleteItem = () => {
                setFilter(currentFilter.filter(item => item !== key));
              };
              return (
                <Chip key={key} onClick={deleteItem}>
                  {label}
                </Chip>
              );
            })}
          </ChipGroupToolbarItem>
        </ChipGroup>
      </SplitItem>
      <SplitItem>
        <Button variant="link" onClick={() => setFilter([])}>Clear filters</Button>
      </SplitItem>
    </Split>
  );
}

ClusterListFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.arrayOf(PropTypes.string),
};

export default ClusterListFilterChipGroup;
