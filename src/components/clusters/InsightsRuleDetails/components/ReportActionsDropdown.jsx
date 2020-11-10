
import React from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown, DropdownToggle, DropdownPosition, DropdownItem,
} from '@patternfly/react-core';

class ReportActionsDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (isOpen) => {
      this.setState({
        isOpen,
      });
    };
    this.onSelect = () => {
      this.setState(state => ({
        isOpen: !state.isOpen,
      }));
    };
  }

  state = {
    isOpen: false,
  }

  render() {
    const {
      report,
      disableRule,
      enableRule,
    } = this.props;
    const { isOpen } = this.state;

    const toggleComponent = (
      <DropdownToggle onToggle={this.onToggle}>
        Actions
      </DropdownToggle>
    );

    const actions = [{
      title: `${report.disabled ? 'Enable' : 'Disable'} health check`,
      onClick: () => {
        if (report.disabled) {
          enableRule(report.rule_id);
        } else {
          disableRule(report.rule_id);
        }
      },
    }];

    const menuItems = actions.map(
      action => (
        <DropdownItem
          key={action.title}
          ouiaId={action.title}
          {...action}
        >
          {action.title}
        </DropdownItem>
      ),
    );
    return (
      <Dropdown
        position={DropdownPosition.right}
        onSelect={this.onSelect}
        dropdownItems={menuItems}
        toggle={toggleComponent}
        isOpen={isOpen}
        ouiaId="actions"
      />
    );
  }
}

ReportActionsDropdown.propTypes = {
  report: PropTypes.object.isRequired,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
};

export default ReportActionsDropdown;
