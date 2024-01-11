import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '@patternfly/react-core';
import {
  Dropdown as DropdownDeprecated,
  DropdownToggle as DropdownToggleDeprecated,
  DropdownGroup as DropdownGroupDeprecated,
  DropdownItem as DropdownItemDeprecated,
} from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import get from 'lodash/get';

import { productFilterOptions } from '../../../../../common/subscriptionTypes';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';
import './ClusterListFilterDropdown.scss';

class ClusterListFilterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (_, isOpen) => {
      this.setState({ isOpen });
    };
  }

  state = { isOpen: false };

  render() {
    const { isOpen } = this.state;
    const { currentFilters, setFilter, history, className, isDisabled } = this.props;
    const filterOptions = [
      {
        key: 'plan_id',
        label: 'Cluster type',
        options: productFilterOptions,
        selected: {},
      },
    ];

    const setFilterAndQueryParams = (filter) => {
      if (history !== undefined) {
        history.push({
          ...history.location,
          search: buildFilterURLParams(filter),
        });
      }
      setFilter(filter);
    };

    const dropdownItems = filterOptions.map((group) => {
      const selected = {};
      const currentFilter = get(currentFilters, group.key, []);
      currentFilter.forEach((activeFilter) => {
        selected[activeFilter] = true;
      });
      return (
        <DropdownGroupDeprecated key={`filtergroup-${group.key}`} label={group.label}>
          {group.options.map((option) => {
            const onChange = (_event, checked) => {
              if (checked) {
                setFilterAndQueryParams({
                  ...currentFilters,
                  [group.key]: [...currentFilter, option.key],
                });
              } else {
                setFilterAndQueryParams({
                  ...currentFilters,
                  [group.key]: currentFilter.filter((item) => item !== option.key),
                });
              }
            };
            return (
              <DropdownItemDeprecated key={option.key}>
                <Checkbox
                  isChecked={selected[option.key]}
                  id={option.key}
                  label={option.label}
                  onChange={onChange}
                />
              </DropdownItemDeprecated>
            );
          })}
        </DropdownGroupDeprecated>
      );
    });
    return (
      <DropdownDeprecated
        toggle={
          <DropdownToggleDeprecated onToggle={this.onToggle} isDisabled={isDisabled}>
            <FilterIcon /> Cluster type
          </DropdownToggleDeprecated>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
        isGrouped
        className={className}
      />
    );
  }
}

ClusterListFilterDropdown.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  history: PropTypes.shape({
    location: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
  }),
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default ClusterListFilterDropdown;
