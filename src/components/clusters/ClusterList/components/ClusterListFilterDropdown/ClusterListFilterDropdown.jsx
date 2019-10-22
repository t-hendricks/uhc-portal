import React from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown, DropdownToggle, DropdownGroup, DropdownItem, Checkbox,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

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
    const { currentFilter, setFilter } = this.props;
    const selected = {};
    currentFilter.forEach((activeFilter) => { selected[activeFilter] = true; });

    const filterOptions = [
      ['Ok', 'Subscribed'],
      ['NotSet', 'Not Subscribed'],
      ['Overcommitted', 'Insufficient'],
      ['InconsistentServices', 'Invalid'],
      ['NotReconciled', 'Unknown'],
    ];

    const dropdownItems = [
      <DropdownGroup key="entitlement_status" label="Subscription Status">
        {filterOptions.map((option) => {
          const key = option[0];
          const label = option[1];
          const onChange = (checked) => {
            if (checked) {
              setFilter([...currentFilter, key]);
            } else {
              setFilter(currentFilter.filter(item => item !== key));
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
      </DropdownGroup>,
    ];
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
      />
    );
  }
}

ClusterListFilterDropdown.propTypes = {
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.arrayOf(PropTypes.string),
};

export default ClusterListFilterDropdown;
