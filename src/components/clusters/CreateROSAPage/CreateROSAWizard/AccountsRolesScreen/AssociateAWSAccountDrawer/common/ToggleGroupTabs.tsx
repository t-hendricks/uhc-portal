import React, { ReactElement } from 'react';
import { Tabs, Tab, TabTitleText, TabContentBody } from '@patternfly/react-core';

import './toggleGroupTabs.scss';

type ToggleGroupTabsProps = {
  tabs: { title: string; body: ReactElement }[];
};

const ToggleGroupTabs = ({ tabs }: ToggleGroupTabsProps) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  return (
    <Tabs
      activeKey={activeTabKey}
      onSelect={(event, key) => setActiveTabKey(key)}
      isBox
      className="pf-u-mt-lg associate-roles-drawer__tabs pf-u-mb-sm"
    >
      {tabs.map((tab, index) => (
        <Tab eventKey={index} title={<TabTitleText>{tab.title}</TabTitleText>}>
          <TabContentBody className="ocm-instruction-block">{tab.body}</TabContentBody>
        </Tab>
      ))}
    </Tabs>
  );
};

export default ToggleGroupTabs;
