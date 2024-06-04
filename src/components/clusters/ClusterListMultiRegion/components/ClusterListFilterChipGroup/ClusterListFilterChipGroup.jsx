import React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';

import { Button, Chip, ChipGroup, Split, SplitItem } from '@patternfly/react-core';

import helpers from '../../../../../common/helpers';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';
import { productFilterOptions } from '../../../../../common/subscriptionTypes';

function ClusterListFilterChipGroup({ currentFilters, setFilter }) {
  const navigate = useNavigate();
  if (helpers.nestedIsEmpty(currentFilters)) {
    return null;
  }

  // TODO extract this to an action.
  const setFilterAndQueryParams = (filter) => {
    navigate(
      {
        search: buildFilterURLParams(filter),
      },
      { replace: true },
    );
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
    <Split data-testid="cluster-list-filter-chipgroup">
      <SplitItem>
        <ChipGroup>
          {groups
            .map((group) => {
              const currentFilter = currentFilters[group.key] || [];
              if (isEmpty(currentFilter)) {
                return null;
              }
              return (
                <ChipGroup key={`chipgroup-${group.key}`} categoryName={group.label}>
                  {currentFilter.map((key) => {
                    const { label } = group.options.find((opt) => opt.key === key);
                    const deleteItem = () => {
                      setFilterAndQueryParams({
                        ...currentFilters,
                        [group.key]: currentFilter.filter((item) => item !== key),
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
            })
            .filter(Boolean)}
        </ChipGroup>
      </SplitItem>
      <SplitItem>
        <Button variant="link" onClick={() => setFilterAndQueryParams({})}>
          Clear filters
        </Button>
      </SplitItem>
    </Split>
  );
}

ClusterListFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
};

export default ClusterListFilterChipGroup;
