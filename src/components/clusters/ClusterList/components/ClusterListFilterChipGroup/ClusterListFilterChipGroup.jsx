import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { Chip, ChipGroup, ChipGroupToolbarItem } from '@patternfly/react-core';

function ClusterListFilterChipGroup({ currentFilter, setFilter }) {
  if (isEmpty(currentFilter)) {
    return null;
  }

  const filterLabels = {
    Ok: 'Subscribed',
    NotSet: 'Not Subscribed',
    Overcommitted: 'Insufficient',
    InconsistentServices: 'Invalid',
  };


  return (
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
  );
}

ClusterListFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.arrayOf(PropTypes.string),
};

export default ClusterListFilterChipGroup;
