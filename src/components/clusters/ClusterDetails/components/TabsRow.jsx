import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

class TabsRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0,
    };

    this.handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex,
      });
    };
  }

  render() {
    const {
      displayLogs, displayUsersTab, overviewTabRef, monitoringTabRef, usersTabRef, logsTabRef,
    } = this.props;
    const { activeTabKey } = this.state;

    const overviewTab = (
      <Tab key={0} eventKey={0} title="Overview" tabContentId="overviewTabContent" tabContentRef={overviewTabRef} />
    );

    const monitoringTab = (
      <Tab key={1} eventKey={1} title="Monitoring" tabContentId="monitoringTabContent" tabContentRef={monitoringTabRef} />
    );

    const usersTab = displayUsersTab && (
    <Tab key={2} eventKey={2} title="Users" tabContentId="usersTabContent" tabContentRef={usersTabRef} />
    );

    const logsTab = displayLogs && (
    <Tab key={3} eventKey={3} title="Logs" tabContentId="logsTabContent" tabContentRef={logsTabRef} />
    );

    const tabsToDisplay = [overviewTab, monitoringTab, usersTab, logsTab].filter(Boolean);

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {tabsToDisplay.map(tab => tab)}
      </Tabs>);
  }
}

TabsRow.propTypes = {
  displayLogs: PropTypes.bool,
  displayUsersTab: PropTypes.bool,
  overviewTabRef: PropTypes.object.isRequired,
  monitoringTabRef: PropTypes.object.isRequired,
  logsTabRef: PropTypes.object.isRequired,
  usersTabRef: PropTypes.object.isRequired,
};

TabsRow.defaultProps = {
  displayLogs: false,
  displayUsersTab: false,
};

export default TabsRow;
