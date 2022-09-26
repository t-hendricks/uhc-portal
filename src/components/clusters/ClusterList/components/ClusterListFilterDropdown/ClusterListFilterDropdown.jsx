import React from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown,
  DropdownToggle,
  DropdownGroup,
  DropdownItem,
  Checkbox,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import get from 'lodash/get';

import { productFilterOptions } from '../../../../../common/subscriptionTypes';
import { buildFilterURLParams } from '../../../../../common/queryHelpers';
import './ClusterListFilterDropdown.scss';

class ClusterListFilterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (isOpen) => {
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
        <DropdownGroup key={`filtergroup-${group.key}`} label={group.label}>
          {group.options.map((option) => {
            const onChange = (checked) => {
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
              <DropdownItem key={option.key}>
                <Checkbox
                  className="pf-c-dropdown__menu-item"
                  isChecked={selected[option.key]}
                  id={option.key}
                  label={option.label}
                  onChange={onChange}
                />
              </DropdownItem>
            );
          })}
        </DropdownGroup>
      );
    });
    return (
      <Dropdown
        toggle={
          <DropdownToggle onToggle={this.onToggle} isDisabled={isDisabled}>
            <FilterIcon /> Cluster type
          </DropdownToggle>
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
    push: PropTypes.func.isRequired,
  }),
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default ClusterListFilterDropdown;
