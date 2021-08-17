import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

import './TabsRow.scss';

class TabsRow extends React.Component {
  state = {
    activeTabKey: 0,
  };

  getTabs() {
    const {
      reasonTabRef,
      resolutionTabRef,
      moreinfoTabRef,
      showMoreInfo,
    } = this.props;
    return [
      {
        key: 0,
        title: 'How to remediate',
        contentId: 'resolutionTabContent',
        ref: resolutionTabRef,
        show: true,
      },
      {
        key: 1,
        title: 'Reason',
        contentId: 'reasonTabContent',
        ref: reasonTabRef,
        show: true,
      },
      {
        key: 2,
        title: 'Additional info',
        contentId: 'moreinfoTabContent',
        ref: moreinfoTabRef,
        show: showMoreInfo,
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

    return (
      <Tabs
        activeKey={activeTabKey}
        onSelect={this.handleTabClick}
        ouiaId="rule_details_tab"
      >
        {this.getTabs().map(tab => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={tab.title}
            ouiaId={tab.title}
            tabContentId={tab.contentId}
            isHidden={!tab.show}
          />
        ))}
      </Tabs>
    );
  }
}

TabsRow.propTypes = {
  reasonTabRef: PropTypes.object.isRequired,
  resolutionTabRef: PropTypes.object.isRequired,
  moreinfoTabRef: PropTypes.object.isRequired,
  showMoreInfo: PropTypes.bool.isRequired,
};

export default TabsRow;
