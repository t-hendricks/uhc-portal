import React from 'react';
import PropTypes from 'prop-types';

import {
  Tabs, Tab, TabTitleText, TabTitleIcon,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';


class TabsRow extends React.Component {
  state = {
    activeTabKey: 0,
  }

  componentDidUpdate() {
    const { activeTabKey } = this.state;
    const {
      overviewTabRef,
    } = this.props;
    const activeTab = this.getTabs()[activeTabKey];
    if (!activeTab.show) {
      this.handleTabClick(undefined, 0);
      overviewTabRef.current.hidden = false;
    }
  }

  getTabs() {
    const {
      displayMonitoringTab,
      displayAccessControlTab,
      displayAddOnsTab,
      displayNetworkingTab,
      displayInsightsTab,
      overviewTabRef,
      monitoringTabRef,
      accessControlTabRef,
      addOnsTabRef,
      networkingTabRef,
      insightsTabRef,
      hasIssues,
    } = this.props;
    return [
      {
        key: 0,
        title: 'Overview',
        contentId: 'overviewTabContent',
        show: true,
        ref: overviewTabRef,
      },
      {
        key: 1,
        title:
  <>
    <TabTitleText>Monitoring</TabTitleText>
    {hasIssues
    && <TabTitleIcon id="issues-icon"><ExclamationCircleIcon color={global_danger_color_100.value} /></TabTitleIcon>}
  </>,
        contentId: 'monitoringTabContent',
        show: displayMonitoringTab,
        ref: monitoringTabRef,
      },
      {
        key: 2,
        title: 'Access control',
        contentId: 'accessControlTabContent',
        show: displayAccessControlTab,
        ref: accessControlTabRef,
      },
      {
        key: 3,
        title: 'Add-ons',
        contentId: 'addOnsTabContent',
        show: displayAddOnsTab,
        ref: addOnsTabRef,
      },
      {
        key: 4,
        title: 'Networking',
        contentId: 'networkingTabContent',
        show: displayNetworkingTab,
        ref: networkingTabRef,
      },
      {
        key: 5,
        title: 'Insights',
        contentId: 'insightsTabContent',
        show: displayInsightsTab,
        ref: insightsTabRef,
      },
    ];
  }

  handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex,
    });
    this.getTabs().forEach((tab) => {
      if (tab.ref && tab.ref.current) {
        if (tab.key !== tabIndex) {
          // eslint-disable-next-line no-param-reassign
          tab.ref.current.hidden = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          tab.ref.current.hidden = false;
        }
      }
    });
  };

  render() {
    const { activeTabKey } = this.state;

    const tabsToDisplay = this.getTabs().filter(tab => tab.show);
    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {tabsToDisplay.map(tab => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={<TabTitleText>{tab.title}</TabTitleText>}
            tabContentId={tab.contentId}
          />
        ))}
      </Tabs>
    );
  }
}

TabsRow.propTypes = {
  displayMonitoringTab: PropTypes.bool,
  displayAccessControlTab: PropTypes.bool,
  displayAddOnsTab: PropTypes.bool,
  displayInsightsTab: PropTypes.bool,
  displayNetworkingTab: PropTypes.bool,
  overviewTabRef: PropTypes.object.isRequired,
  monitoringTabRef: PropTypes.object.isRequired,
  accessControlTabRef: PropTypes.object.isRequired,
  addOnsTabRef: PropTypes.object.isRequired,
  insightsTabRef: PropTypes.object.isRequired,
  networkingTabRef: PropTypes.object.isRequired,
  hasIssues: PropTypes.bool.isRequired,
};

TabsRow.defaultProps = {
  displayMonitoringTab: true,
  displayInsightsTab: false,
  displayAccessControlTab: false,
  displayAddOnsTab: false,
  displayNetworkingTab: false,
};

export default TabsRow;
