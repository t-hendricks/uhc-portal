import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Chip, ChipGroup, Button, Split, SplitItem,
} from '@patternfly/react-core';

import helpers from '../../../../../common/helpers';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';

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
      key: 'plan_id',
      label: 'Cluster type',
      optionLabels: {
        OSD: 'OSD',
        OCP: 'OCP',
      },
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
  }).isRequired,
};

export default ClusterListFilterChipGroup;
