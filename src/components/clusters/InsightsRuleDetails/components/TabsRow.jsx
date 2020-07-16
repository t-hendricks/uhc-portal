import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

class TabsRow extends React.Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    activeTabKey: this.props.displayReasonTab ? 0 : 1,
  }

  componentDidUpdate() {
    const { activeTabKey } = this.state;
    const activeTab = this.getTabs()[activeTabKey];
    if (!activeTab.show) {
      this.handleTabClick(undefined, 0);
      this.getTabs()[Math.abs(activeTabKey - 1)].ref.current.hidden = false;
    }
  }

  getTabs() {
    const {
      displayReasonTab,
      displayResolutionTab,
      reasonTabRef,
      resolutionTabRef,
    } = this.props;
    return [
      {
        key: 0,
        title: 'Reason',
        contentId: 'reasonTabContent',
        show: displayReasonTab,
        ref: reasonTabRef,
      },
      {
        key: 1,
        title: 'How to remediate',
        contentId: 'resolutionTabContent',
        show: displayResolutionTab,
        ref: resolutionTabRef,
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
          <Tab key={tab.key} eventKey={tab.key} title={tab.title} tabContentId={tab.contentId} />
        ))}
      </Tabs>
    );
  }
}

TabsRow.propTypes = {
  displayReasonTab: PropTypes.bool,
  displayResolutionTab: PropTypes.bool,
  reasonTabRef: PropTypes.object.isRequired,
  resolutionTabRef: PropTypes.object.isRequired,
};

export default TabsRow;
