import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import { Button, Chip, ChipGroup, Split, SplitItem } from '@patternfly/react-core';

import { SEVERITY_TYPES, LOG_TYPES } from '../clusterLogConstants';
import { buildFilterURLParams } from '../../../../../../common/queryHelpers';
import helpers from '../../../../../../common/helpers';

const mapFilterGroup = (group, currentFilter, setFilter, navigate, location) => {
  const setFilterAndQueryParams = (key, value) => {
    navigate(
      {
        pathname: location.path,
        hash: location.hash,
        search: buildFilterURLParams({ [key]: [value] }),
      },
      { replace: true },
    );
    setFilter(value);
  };

  const { key } = group;
  const filter = currentFilter[key] || [];
  if (isEmpty(filter)) {
    return null;
  }
  const deleteItem = () => {
    setFilterAndQueryParams(key, {
      ...currentFilter,
      [group.key]: '',
    });
  };
  return (
    <ChipGroup key={`chipgroup-${group.key}`} categoryName={group.label}>
      <Chip key={key} onClick={deleteItem}>
        {filter}
      </Chip>
    </ChipGroup>
  );
};

const mapFlagsGroup = (group, currentFlags, setFlags, navigate, location) => {
  const setFilterAndQueryParams = (flags) => {
    navigate(
      {
        pathname: location.path,
        hash: location.hash,
        search: buildFilterURLParams(flags),
      },
      { replace: true },
    );
    setFlags(flags);
  };

  const currentFlag = currentFlags[group.key] || [];
  if (isEmpty(currentFlag)) {
    return null;
  }
  return (
    <ChipGroup key={`chipgroup-${group.key}`} categoryName={group.label}>
      {currentFlag.map((value) => {
        const label = group.optionLabels[value];
        const deleteItem = () => {
          setFilterAndQueryParams({
            ...currentFlags,
            [group.key]: currentFlag.filter((item) => item !== value),
          });
        };
        return (
          <Chip key={value} onClick={deleteItem}>
            {label}
          </Chip>
        );
      })}
    </ChipGroup>
  );
};

const clearFilters = (navigate, clearFiltersAndFlags, location) => {
  navigate(
    {
      hash: location.hash,
      search: '',
    },
    { replace: true },
  );
  clearFiltersAndFlags();
};

const groupFlags = [
  {
    key: 'severityTypes',
    label: 'Severity Type',
    optionLabels: SEVERITY_TYPES.reduce((map, key) => {
      /* eslint-disable-next-line no-param-reassign */
      map[key] = key;
      return map;
    }, {}),
  },
  {
    key: 'logTypes',
    label: 'Type',
    optionLabels: LOG_TYPES.reduce((map, key) => {
      /* eslint-disable-next-line no-param-reassign */
      map[key] = key;
      return map;
    }, {}),
  },
];

function ClusterLogsFilterChipGroup({
  currentFilter,
  setFilter,
  currentFlags,
  setFlags,
  clearFiltersAndFlags,
}) {
  const groupFilters = [
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'loggedBy',
      label: 'Logged by',
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  // Do not count the timestamps filters
  const { timestampFrom, timestampTo, ...currentFilterNoTimestamps } = currentFilter;
  if (helpers.nestedIsEmpty(currentFilterNoTimestamps) && helpers.nestedIsEmpty(currentFlags)) {
    return null;
  }
  return (
    <Split>
      <SplitItem>
        {/* Filters */}
        <ChipGroup>
          {groupFilters
            .map((group) => mapFilterGroup(group, currentFilter, setFilter, navigate, location))
            .filter(Boolean)}
        </ChipGroup>
        {/* Flags */}
        <ChipGroup>
          {groupFlags
            .map((group) => mapFlagsGroup(group, currentFlags, setFlags, navigate, location))
            .filter(Boolean)}
        </ChipGroup>
      </SplitItem>
      <SplitItem>
        <Button
          variant="link"
          onClick={() => clearFilters(navigate, clearFiltersAndFlags, location)}
        >
          Clear filters
        </Button>
      </SplitItem>
    </Split>
  );
}

ClusterLogsFilterChipGroup.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    description: PropTypes.string,
    loggedBy: PropTypes.string,
    timestampFrom: PropTypes.string,
    timestampTo: PropTypes.string,
  }).isRequired,
  setFlags: PropTypes.func.isRequired,
  currentFlags: PropTypes.shape({
    severityTypes: PropTypes.arrayOf(PropTypes.string),
    logTypes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  clearFiltersAndFlags: PropTypes.func.isRequired,
};

export default ClusterLogsFilterChipGroup;
