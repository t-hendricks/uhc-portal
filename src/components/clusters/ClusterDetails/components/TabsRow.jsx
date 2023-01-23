import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, TabTitleText, TabTitleIcon, Tooltip, Tab } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

class TabsRow extends React.Component {
  state = {
    activeTabKey: 0,
    initialTabKey: this.getInitTab(),
  };

  componentDidMount() {
    window.addEventListener('popstate', this.onPopState);
    const { initialTabKey } = this.state;
    const initialTab = this.getTabs()[initialTabKey];
    if (initialTab?.isDisabled) {
      this.setState({ initialTabKey: 0 });
      this.handleTabClick(undefined, 0);
    }
  }

  componentDidUpdate() {
    const { activeTabKey, initialTabKey } = this.state;
    const { overviewTabRef } = this.props;
    const activeTab = this.getTabs()[activeTabKey];
    if (!activeTab.show) {
      this.handleTabClick(undefined, 0);
      overviewTabRef.current.hidden = false;
    }

    const initialTab = this.getTabs()[initialTabKey];
    if (initialTabKey !== null && initialTab.show && !initialTab.isDisabled) {
      this.handleTabClick(undefined, initialTabKey);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
  }

  getInitTab() {
    const { initTabOpen } = this.props;
    const tabIndex = this.getTabs().findIndex((tab) => tab.id === initTabOpen);
    if (tabIndex === -1) {
      return 0;
    }
    return tabIndex;
  }

  getTabs() {
    const {
      displayMonitoringTab,
      displayAccessControlTab,
      displayAddOnsTab,
      displayClusterHistoryTab,
      displayNetworkingTab,
      displaySupportTab,
      displayMachinePoolsTab,
      displayUpgradeSettingsTab,
      addHostTabDetails,
      overviewTabRef,
      monitoringTabRef,
      accessControlTabRef,
      addOnsTabRef,
      clusterHistoryTabRef,
      networkingTabRef,
      supportTabRef,
      machinePoolsTabRef,
      upgradeSettingsTabRef,
      addAssistedTabRef,
      hasIssues,
      isHypershift,
    } = this.props;
    return [
      {
        key: 0,
        title: 'Overview',
        contentId: 'overviewTabContent',
        id: 'overview',
        show: true,
        ref: overviewTabRef,
      },
      {
        key: 1,
        title: (
          <>
            <TabTitleText>Monitoring</TabTitleText>
            {hasIssues && (
              <TabTitleIcon id="monitoring-issues-icon">
                <ExclamationCircleIcon className="danger" />
              </TabTitleIcon>
            )}
          </>
        ),
        contentId: 'monitoringTabContent',
        id: 'monitoring',
        show: displayMonitoringTab,
        ref: monitoringTabRef,
      },
      {
        key: 2,
        title: 'Access control',
        id: 'accessControl',
        contentId: 'accessControlTabContent',
        show: displayAccessControlTab,
        ref: accessControlTabRef,
      },
      {
        key: 3,
        title: 'Add-ons',
        contentId: 'addOnsTabContent',
        id: 'addOns',
        show: displayAddOnsTab,
        ref: addOnsTabRef,
        isDisabled: isHypershift,
        tooltip: isHypershift ? (
          <Tooltip content="Add-ons will be available soon for hosted control plane clusters." />
        ) : undefined,
      },
      {
        key: 4,
        title: 'Cluster history',
        contentId: 'clusterHistoryTabContent',
        id: 'clusterHistory',
        show: displayClusterHistoryTab,
        ref: clusterHistoryTabRef,
      },
      {
        key: 5,
        title: 'Networking',
        contentId: 'networkingTabContent',
        id: 'networking',
        show: displayNetworkingTab,
        ref: networkingTabRef,
      },
      {
        key: 6,
        title: 'Machine pools',
        contentId: 'machinePoolsTabContent',
        id: 'machinePools',
        show: displayMachinePoolsTab,
        ref: machinePoolsTabRef,
      },
      {
        key: 7,
        title: 'Support',
        contentId: 'supportTabContent',
        id: 'support',
        show: displaySupportTab,
        ref: supportTabRef,
      },
      {
        key: 8,
        title: 'Settings',
        contentId: 'upgradeSettingsTabContent',
        id: 'updateSettings',
        show: displayUpgradeSettingsTab,
        ref: upgradeSettingsTabRef,
      },
      {
        key: 9,
        title: 'Add Hosts',
        contentId: 'addHostsContent',
        id: 'addAssistedHosts',
        show: addHostTabDetails.showTab,
        ref: addAssistedTabRef,
        isDisabled: addHostTabDetails.isDisabled,
        tooltip: addHostTabDetails.tabTooltip ? (
          <Tooltip content={addHostTabDetails.tabTooltip} />
        ) : undefined,
      },
    ];
  }

  handleTabClick = (event, tabIndex) => {
    const { setOpenedTab, onTabSelected } = this.props;
    const tabs = this.getTabs();
    this.setState(
      (state) => ({
        activeTabKey: tabIndex,
        initialTabKey: state.initialTabKey === tabIndex ? null : state.initialTabKey,
      }),
      () => {
        const { initialTabKey } = this.state;
        if (initialTabKey === null) {
          setOpenedTab(tabs[tabIndex].id);
        }
      },
    );
    tabs.forEach((tab) => {
      if (tab.ref && tab.ref.current) {
        if (tab.key !== tabIndex) {
          // eslint-disable-next-line no-param-reassign
          tab.ref.current.hidden = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          tab.ref.current.hidden = false;
          onTabSelected(tab.id);
        }
      }
    });
  };

  /* use browser API (window) as a temporary workaround to change
     the active tab when hash is changed inside URL */
  onPopState = ({ target }) => {
    const targetTab = this.getTabs().find((t) => t.id === target.location.hash.substring(1));
    const targetTabKey = targetTab?.key;
    if (targetTab?.isDisabled) {
      this.handleTabClick(undefined, 0);
    } else if (targetTabKey !== undefined) {
      this.handleTabClick(undefined, targetTabKey);
    }
  };

  render() {
    const { activeTabKey } = this.state;

    const tabsToDisplay = this.getTabs().filter((tab) => tab.show);

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {tabsToDisplay.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={<TabTitleText>{tab.title}</TabTitleText>}
            tabContentId={tab.contentId}
            ouiaId={tab.title}
            isAriaDisabled={tab.isDisabled || false}
            tooltip={tab.tooltip}
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
  displayClusterHistoryTab: PropTypes.bool,
  displayNetworkingTab: PropTypes.bool,
  displaySupportTab: PropTypes.bool,
  displayMachinePoolsTab: PropTypes.bool,
  displayUpgradeSettingsTab: PropTypes.bool,
  addHostTabDetails: PropTypes.shape({
    showTab: PropTypes.bool,
    isDisabled: PropTypes.bool,
    tabTooltip: PropTypes.string,
  }),
  overviewTabRef: PropTypes.object.isRequired,
  monitoringTabRef: PropTypes.object.isRequired,
  accessControlTabRef: PropTypes.object.isRequired,
  addOnsTabRef: PropTypes.object.isRequired,
  clusterHistoryTabRef: PropTypes.object.isRequired,
  machinePoolsTabRef: PropTypes.object.isRequired,
  networkingTabRef: PropTypes.object.isRequired,
  supportTabRef: PropTypes.object.isRequired,
  upgradeSettingsTabRef: PropTypes.object.isRequired,
  addAssistedTabRef: PropTypes.object.isRequired,
  hasIssues: PropTypes.bool.isRequired,
  isHypershift: PropTypes.bool.isRequired,
  initTabOpen: PropTypes.string,
  setOpenedTab: PropTypes.func.isRequired,
  onTabSelected: PropTypes.func.isRequired,
};

TabsRow.defaultProps = {
  displayMonitoringTab: true,
  displayAccessControlTab: false,
  displayAddOnsTab: false,
  displayClusterHistoryTab: false,
  displayNetworkingTab: false,
  displayMachinePoolsTab: false,
  addHostTabDetails: {
    showTab: false,
    isDisabled: false,
    tabTooltip: '',
  },
  initTabOpen: '',
};

export default TabsRow;
