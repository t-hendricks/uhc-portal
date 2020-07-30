import React from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown, DropdownToggle, DropdownGroup, DropdownItem, Checkbox,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import get from 'lodash/get';

import { buildFilterURLParams } from '../../../../../common/queryHelpers';


class ClusterListFilterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (isOpen) => {
      this.setState({ isOpen });
    };
  }

  state = { isOpen: false }

  render() {
    const { isOpen } = this.state;
    const {
      currentFilters,
      setFilter,
      history,
      className,
      isDisabled,
    } = this.props;
    const filterOptions = [
      {
        key: 'plan_id',
        label: 'Cluster type',
        options: [
          ['OSD', 'OSD'],
          ['OCP', 'OCP'],
        ],
        selected: {},
      },
    ];

    const setFilterAndQueryParams = (filter) => {
      history.push({
        search: buildFilterURLParams(filter),
      });
      setFilter(filter);
    };

    const dropdownItems = filterOptions.map((group) => {
      const selected = {};
      const currentFilter = get(currentFilters, group.key, []);
      currentFilter.forEach((activeFilter) => { selected[activeFilter] = true; });
      return (
        <DropdownGroup key={`filtergroup-${group.key}`} label={group.label}>
          {group.options.map((option) => {
            const key = option[0];
            const label = option[1];
            const onChange = (checked) => {
              if (checked) {
                setFilterAndQueryParams({
                  ...currentFilters, [group.key]: [...currentFilter, key],
                });
              } else {
                setFilterAndQueryParams({
                  ...currentFilters,
                  [group.key]: currentFilter.filter(item => item !== key),
                });
              }
            };
            return (
              <DropdownItem key={key}>
                <Checkbox
                  className="pf-c-dropdown__menu-item"
                  isChecked={selected[key]}
                  id={key}
                  label={label}
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
        toggle={(
          <DropdownToggle onToggle={this.onToggle} isDisabled={isDisabled}>
            <FilterIcon />
            {' '}
            Filter
          </DropdownToggle>
        )}
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
  }).isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default ClusterListFilterDropdown;
