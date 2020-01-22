import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Chip, ChipGroup, ChipGroupToolbarItem, Button, Split, SplitItem,
} from '@patternfly/react-core';

import helpers from '../../../../../common/helpers';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';
import { entitlementStatuses, entitlementStatusDisplayNames } from '../../../../../common/subscriptionTypes';

function ClusterListFilterChipGroup({ currentFilters, setFilter, history }) {
  if (helpers.nestedIsEmpty(currentFilters)) {
    return null;
  }

  const setFilterAndQueryParams = (filter) => {
    history.push({
      search: buildFilterURLParams(filter),
    });
    setFilter(filter);
  };

  const groups = [
    {
      key: 'entitlement_status',
      label: 'Subscription status',
      optionLabels: Object.entries(entitlementStatuses).map(
        // create an array of arrays mapping API types to human readable names
        // (like in ClusterListFilterDropdown)
        ([key, value]) => [value, entitlementStatusDisplayNames[key]],
      ).reduce((result, [key, value]) => ({
        ...result, // reduce to turn the array into an object, for easy lookups
        [key]: value,
      }), {}),
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
                    setFilterAndQueryParams({
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
        <Button variant="link" onClick={() => setFilterAndQueryParams({})}>Clear filters</Button>
      </SplitItem>
    </Split>
  );
}

ClusterListFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClusterListFilterChipGroup;
