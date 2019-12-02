import React from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown, DropdownToggle, DropdownGroup, DropdownItem, Checkbox,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import get from 'lodash/get';

import { entitlementStatuses } from '../../../../../common/subscriptionTypes';
import helpers from '../../../../../common/helpers';


class ClusterListFilterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.onToggle = (isOpen) => {
      this.setState({ isOpen });
    };
  }

  render() {
    const { isOpen } = this.state;
    const {
      currentFilters,
      setFilter,
      history,
      className,
    } = this.props;
    const filterOptions = [
      {
        key: 'entitlement_status',
        label: 'Subscription Status',
        options: [
          [entitlementStatuses.OK, 'Subscribed'],
          [entitlementStatuses.NOT_SET, 'Not Subscribed'],
          [entitlementStatuses.OVERCOMMITTED, 'Insufficient'],
          [entitlementStatuses.INCONSISTENT_SERVICES, 'Invalid'],
          [entitlementStatuses.UNKNOWN, 'Unknown'],
        ],
        selected: {},
      },
      {
        key: 'plan_id',
        label: 'Cluster Type',
        options: [
          ['OSD', 'OSD'],
          ['OCP', 'OCP'],
        ],
        selected: {},
      },
    ];

    const setFilterAndQueryParams = (filter) => {
      history.push({
        search: helpers.buildFilterURLParams(filter),
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
                <div>
                  {/* Hack: the extra div is here because PatternFly
                REMOVES the pf-c-dropdown__menu-itemclassName from
                the first child, but doesn't put it anywhere if the child
                is a checkbox, so the dropdown is not styled correctly.

                Having a div here ensures the dropdown items will be styled correctly. */}
                  <Checkbox
                    className="pf-c-dropdown__menu-item"
                    isChecked={selected[key]}
                    id={key}
                    label={label}
                    onChange={onChange}
                  />
                </div>
              </DropdownItem>
            );
          })}
        </DropdownGroup>
      );
    });
    return (
      <Dropdown
        toggle={(
          <DropdownToggle onToggle={this.onToggle}>
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
};

export default ClusterListFilterDropdown;
