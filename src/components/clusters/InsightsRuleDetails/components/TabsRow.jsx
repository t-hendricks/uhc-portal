import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@patternfly/react-core';

class TabsRow extends React.Component {
  state = {
    activeTabKey: 0,
  }

  getTabs() {
    const {
      reasonTabRef,
      resolutionTabRef,
    } = this.props;
    return [
      {
        key: 0,
        title: 'Reason',
        contentId: 'reasonTabContent',
        ref: reasonTabRef,
        show: true,
      },
      {
        key: 1,
        title: 'How to remediate',
        contentId: 'resolutionTabContent',
        ref: resolutionTabRef,
        show: true,
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
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {this.getTabs().map(tab => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.title} tabContentId={tab.contentId} />
        ))}
      </Tabs>
    );
  }
}

TabsRow.propTypes = {
  reasonTabRef: PropTypes.object.isRequired,
  resolutionTabRef: PropTypes.object.isRequired,
};

export default TabsRow;
