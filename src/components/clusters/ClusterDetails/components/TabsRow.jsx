import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

const tabs = {
  overview: 0,
  monitoring: 1,
  accessControl: 2,
  addons: 3,
  logs: 4,
  insights: 5,
  networking: 6,
};

class TabsRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex,
      });
    };
  }

  state = {
    activeTabKey: 0,
  }

  componentDidUpdate() {
    const { activeTabKey } = this.state;
    const {
      overviewTabRef,
      displayMonitoringTab,
      displayAccessControlTab,
      displayAddOnsTab,
      displayLogs,
      displayInsightsTab,
      displayNetworkingTab,
    } = this.props;
    if ((activeTabKey === tabs.monitoring && !displayMonitoringTab)
        || (activeTabKey === tabs.accessControl && !displayAccessControlTab)
        || (activeTabKey === tabs.addons && !displayAddOnsTab)
        || (activeTabKey === tabs.insights && !displayInsightsTab)
        || (activeTabKey === tabs.logs && !displayLogs)
        || (activeTabKey === tabs.networking && !displayNetworkingTab)) {
      this.handleTabClick(undefined, tabs.overview);
      overviewTabRef.current.hidden = false;
    }
  }

  render() {
    const {
      displayMonitoringTab,
      displayAccessControlTab,
      displayAddOnsTab,
      displayLogs,
      displayInsightsTab,
      displayNetworkingTab,
      overviewTabRef,
      monitoringTabRef,
      accessControlTabRef,
      addOnsTabRef,
      logsTabRef,
      insightsTabRef,
      networkingTabRef,
    } = this.props;
    const { activeTabKey } = this.state;

    const overviewTab = (
      <Tab key={tabs.overview} eventKey={tabs.overview} title="Overview" tabContentId="overviewTabContent" tabContentRef={overviewTabRef} />
    );

    const monitoringTab = displayMonitoringTab && (
      <Tab key={tabs.monitoring} eventKey={tabs.monitoring} title="Monitoring" tabContentId="monitoringTabContent" tabContentRef={monitoringTabRef} />
    );

    const accessControlTab = displayAccessControlTab && (
    <Tab key={tabs.accessControl} eventKey={tabs.accessControl} title="Access Control" tabContentId="accessControlTabContent" tabContentRef={accessControlTabRef} />);

    const addOnsTab = displayAddOnsTab && (
    <Tab key={tabs.addons} eventKey={tabs.addons} title="Add-ons" tabContentId="addOnsTabContent" tabContentRef={addOnsTabRef} />
    );

    const logsTab = displayLogs && (
    <Tab key={tabs.logs} eventKey={tabs.logs} title="Logs" tabContentId="logsTabContent" tabContentRef={logsTabRef} />
    );

    const insightsTab = displayInsightsTab && (
    <Tab key={tabs.insights} eventKey={tabs.insights} title="Insights" tabContentId="insightsTabContent" tabContentRef={insightsTabRef} />
    );

    const networkingTab = displayNetworkingTab && (
    <Tab key={tabs.networking} eventKey={tabs.networking} title="Networking" tabContentId="networkingTabContent" tabContentRef={networkingTabRef} />
    );

    const tabsToDisplay = [
      overviewTab,
      monitoringTab,
      accessControlTab,
      addOnsTab,
      logsTab,
      insightsTab,
      networkingTab,
    ].filter(Boolean);

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {tabsToDisplay.map(tab => tab)}
      </Tabs>
    );
  }
}

TabsRow.propTypes = {
  displayMonitoringTab: PropTypes.bool,
  displayAccessControlTab: PropTypes.bool,
  displayAddOnsTab: PropTypes.bool,
  displayLogs: PropTypes.bool,
  displayInsightsTab: PropTypes.bool,
  displayNetworkingTab: PropTypes.bool,
  overviewTabRef: PropTypes.object.isRequired,
  monitoringTabRef: PropTypes.object.isRequired,
  accessControlTabRef: PropTypes.object.isRequired,
  addOnsTabRef: PropTypes.object.isRequired,
  logsTabRef: PropTypes.object.isRequired,
  insightsTabRef: PropTypes.object.isRequired,
  networkingTabRef: PropTypes.object.isRequired,
};

TabsRow.defaultProps = {
  displayMonitoringTab: true,
  displayInsightsTab: false,
  displayAccessControlTab: false,
  displayAddOnsTab: false,
  displayLogs: false,
  displayNetworkingTab: false,
};

export default TabsRow;
