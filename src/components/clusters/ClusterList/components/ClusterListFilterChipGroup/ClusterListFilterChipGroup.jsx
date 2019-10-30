import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Chip, ChipGroup, ChipGroupToolbarItem, Button, Split, SplitItem,
} from '@patternfly/react-core';

import helpers from '../../../../../common/helpers';

function ClusterListFilterChipGroup({ currentFilters, setFilter }) {
  if (helpers.nestedIsEmpty(currentFilters)) {
    return null;
  }

  const groups = [
    {
      key: 'entitlement_status',
      label: 'Subscription status',
      optionLabels: {
        Ok: 'Subscribed',
        NotSet: 'Not Subscribed',
        Overcommitted: 'Insufficient',
        InconsistentServices: 'Invalid',
        NotReconciled: 'Unknown',
      },
    },
    {
      key: 'plan_id',
      label: 'Cluster Type',
      optionLabels: {
        OSD: 'OSD',
        OCP: 'OCP',
      },
    },
  ];

  return (
    <Split>
      <SplitItem>
        <ChipGroup withToolbar>
          {groups.map((group) => {
            const currentFilter = currentFilters[group.key] || [];
            if (isEmpty(currentFilter)) {
              return null;
            }
            return (
              <ChipGroupToolbarItem key={`chipgroup-${group.key}`} categoryName={group.label}>
                {currentFilter.map((key) => {
                  const label = group.optionLabels[key];
                  const deleteItem = () => {
                    setFilter({
                      ...currentFilters,
                      [group.key]: currentFilter.filter(item => item !== key),
                    });
                  };
                  return (
                    <Chip key={key} onClick={deleteItem}>
                      {label}
                    </Chip>
                  );
                })}
              </ChipGroupToolbarItem>
            );
          }).filter(Boolean)}
        </ChipGroup>
      </SplitItem>
      <SplitItem>
        <Button variant="link" onClick={() => setFilter({})}>Clear filters</Button>
      </SplitItem>
    </Split>
  );
}

ClusterListFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ClusterListFilterChipGroup;
