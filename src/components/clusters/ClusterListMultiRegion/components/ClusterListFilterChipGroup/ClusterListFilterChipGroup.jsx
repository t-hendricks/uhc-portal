import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';

import { Button, Chip, ChipGroup, Split, SplitItem } from '@patternfly/react-core';

import { onListFlagsSet } from '~/redux/actions/viewOptionsActions';
import { CLUSTERS_VIEW } from '~/redux/constants/viewConstants';

import helpers from '../../../../../common/helpers';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';
import { productFilterOptions } from '../../../../../common/subscriptionTypes';

function ClusterListFilterChipGroup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentFilters =
    useSelector((state) => state.viewOptions[CLUSTERS_VIEW].flags.subscriptionFilter) || {};

  const setFilter = (filter) =>
    dispatch(onListFlagsSet('subscriptionFilter', filter, CLUSTERS_VIEW));

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

export default ClusterListFilterChipGroup;
