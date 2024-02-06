import { Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import React from 'react';
import { useHistory } from 'react-router';
import { UnregisterCallback } from 'history';
import { getInitTab, getTabs } from './TabsRow.helper';
import { TabsRowInfoType, TabsRowTabType } from './TabsRow.model';

export type TabsRowProps = {
  tabsInfo: TabsRowInfoType;
  initTabOpen?: string;
  onTabSelected: (...args: any[]) => void;
};

const TabsRow = ({ tabsInfo, onTabSelected, initTabOpen }: TabsRowProps) => {
  const history = useHistory();

  const [tabs, setTabs] = React.useState<TabsRowTabType[]>();
  const [activeTab, setActiveTab] = React.useState<TabsRowTabType>();
  const [previousTab, setPreviousTab] = React.useState<TabsRowTabType>();
  const [initialTab, setInitialTab] = React.useState<TabsRowTabType | null>();
  const [historyPush, setHistoryPush] = React.useState<boolean>(false);

  const handleTabClick = React.useCallback(
    (
      _: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
      tabIndex: number | string,
      historyPush = true,
    ) => {
      if (tabs) {
        setPreviousTab(activeTab);
        setActiveTab(tabs?.find((tab) => tab.key === tabIndex));
        setInitialTab(initialTab?.key === tabIndex ? null : initialTab);
        setHistoryPush(historyPush);
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
      }
    },
    [tabs, activeTab, initialTab, onTabSelected],
  );

  React.useEffect(() => {
    const newTabs = getTabs(tabsInfo);
    setTabs(newTabs);
    setInitialTab(getInitTab(newTabs, initTabOpen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTabOpen]); // TODO: tabsInfo should be added as soon as ClusterDetails is refactored

  React.useEffect(() => {
    let unlisten: UnregisterCallback | undefined;
    if (tabs?.length) {
      unlisten = history.listen((location, action) => {
        // listen to browser back/forward and manual URL changes
        if (['PUSH', 'POP'].includes(action)) {
          const targetTab = tabs.find((tab) => `#${tab.id}` === location.hash);
          handleTabClick(
            undefined,
            targetTab?.isDisabled || !targetTab?.show ? 0 : targetTab.key,
            false,
          );
        }
      });

      if (initialTab !== null && (initialTab?.isDisabled || !initialTab?.show)) {
        setInitialTab(tabs[0]);
        handleTabClick(undefined, 0);
      }
    }

    return () => {
      unlisten?.();
    };
  }, [tabs, initialTab, history, handleTabClick]);

  React.useEffect(() => {
    if (activeTab && !activeTab.show) {
      // TODO: this can only be true in case hidden tab is selected, it is not testeable, so I recommend to remove it
      handleTabClick(undefined, 0);
      // eslint-disable-next-line no-param-reassign
      tabsInfo.overview.ref.current.hidden = false;
    } else if (initialTab?.show && !initialTab?.isDisabled) {
      handleTabClick(undefined, initialTab.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, initialTab, handleTabClick]); // TODO: tabsInfo should be added as soon as ClusterDetails is refactored

  React.useEffect(() => {
    if (initialTab === null && historyPush) {
      history.replace({
        ...(previousTab?.key !== activeTab?.key
          ? { pathname: history.location.pathname }
          : history.location),
        hash: `#${activeTab?.id}`,
      });
    }
  }, [activeTab, initialTab, historyPush, previousTab, history]);

  return tabs && activeTab ? (
    <Tabs activeKey={activeTab.key} onSelect={handleTabClick}>
      {tabs
        .filter((tab) => tab.show)
        .map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={<TabTitleText>{tab.title}</TabTitleText>}
            tabContentId={tab.contentId}
            id={`${tab.title}`}
            ouiaId={`${tab.title}`}
            isAriaDisabled={!!tab.isDisabled}
            tooltip={tab.tooltip}
          />
        ))}
    </Tabs>
  ) : null;
};

export default TabsRow;
