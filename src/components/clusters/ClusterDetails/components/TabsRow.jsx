import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

const tabs = {
  overview: 0,
  monitoring: 1,
  users: 2,
  logs: 3,
};

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

  componentDidUpdate() {
    const { activeTabKey } = this.state;
    const {
      displayLogs,
      displayUsersTab,
      displayMonitoringTab,
      overviewTabRef,
    } = this.props;
    if ((activeTabKey === tabs.monitoring && !displayMonitoringTab)
        || (activeTabKey === tabs.users && !displayUsersTab)
        || (activeTabKey === tabs.logs && !displayLogs)) {
      this.handleTabClick(undefined, tabs.overview);
      overviewTabRef.current.hidden = false;
    }
  }

  render() {
    const {
      displayLogs,
      displayUsersTab,
      displayMonitoringTab,
      overviewTabRef,
      monitoringTabRef,
      usersTabRef,
      logsTabRef,
    } = this.props;
    const { activeTabKey } = this.state;

    const overviewTab = (
      <Tab key={tabs.overview} eventKey={tabs.overview} title="Overview" tabContentId="overviewTabContent" tabContentRef={overviewTabRef} />
    );

    const monitoringTab = displayMonitoringTab && (
      <Tab key={tabs.monitoring} eventKey={tabs.monitoring} title="Monitoring" tabContentId="monitoringTabContent" tabContentRef={monitoringTabRef} />
    );

    const usersTab = displayUsersTab && (
    <Tab key={tabs.users} eventKey={tabs.users} title="Users" tabContentId="usersTabContent" tabContentRef={usersTabRef} />);

    const logsTab = displayLogs && (
    <Tab key={tabs.logs} eventKey={tabs.logs} title="Logs" tabContentId="logsTabContent" tabContentRef={logsTabRef} />
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
  displayMonitoringTab: PropTypes.bool,
  overviewTabRef: PropTypes.object.isRequired,
  monitoringTabRef: PropTypes.object.isRequired,
  logsTabRef: PropTypes.object.isRequired,
  usersTabRef: PropTypes.object.isRequired,
};

TabsRow.defaultProps = {
  displayLogs: false,
  displayUsersTab: false,
  displayMonitoringTab: true,
};

export default TabsRow;
