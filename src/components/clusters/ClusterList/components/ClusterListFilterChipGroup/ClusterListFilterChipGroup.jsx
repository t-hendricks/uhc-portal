import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Chip, ChipGroup, Button, Split, SplitItem,
} from '@patternfly/react-core';

import helpers from '../../../../../common/helpers';
import { productFilterOptions } from '../../../../../common/subscriptionTypes';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';

function ClusterListFilterChipGroup({ currentFilters, setFilter, history }) {
  if (helpers.nestedIsEmpty(currentFilters)) {
    return null;
  }

  // TODO extract this to an action.
  const setFilterAndQueryParams = (filter) => {
    if (history !== undefined) {
      history.push({
        search: buildFilterURLParams(filter),
      });
    }
    setFilter(filter);
  };

  const groups = [
    {
      key: 'plan_id',
      label: 'Cluster type',
      options: productFilterOptions,
    },
  ];

  return (
    <Split>
      <SplitItem>
        <ChipGroup>
          {groups.map((group) => {
            const currentFilter = currentFilters[group.key] || [];
            if (isEmpty(currentFilter)) {
              return null;
            }
            return (
              <ChipGroup key={`chipgroup-${group.key}`} categoryName={group.label}>
                {currentFilter.map((key) => {
                  const { label } = group.options.find(opt => opt.key === key);
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
              </ChipGroup>
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
  }),
};

export default ClusterListFilterChipGroup;
