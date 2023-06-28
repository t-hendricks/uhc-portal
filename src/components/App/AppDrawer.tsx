import React, { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Drawer, DrawerContent, DrawerContentBody, DrawerProps } from '@patternfly/react-core';
import './AppDrawer.scss';

type DrawerSettings = {
  drawerProps?: DrawerProps;
  drawerPanelContent?: React.ReactNode;
};

export const AppDrawerContext = createContext<{
  openDrawer: (settings: DrawerSettings) => void;
  closeDrawer: () => void;
}>({ openDrawer: () => undefined, closeDrawer: () => undefined });

export const AppDrawer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [drawerSettings, setDrawerSettings] = useState<DrawerSettings>({
    drawerProps: { isExpanded: true },
  });
  const openDrawer = useCallback(
    (settings: DrawerSettings) => {
      const { drawerProps, drawerPanelContent } = settings;
      setDrawerSettings({ drawerProps: { ...drawerProps, isExpanded: true }, drawerPanelContent });
    },
    [setDrawerSettings],
  );
  const closeDrawer = useCallback(() => {
    setDrawerSettings((settings: DrawerSettings) => {
      const { drawerProps } = settings;
      return { drawerProps: { ...drawerProps, isExpanded: false } };
    });
  }, [setDrawerSettings]);

  const contextValue = useMemo(() => ({ openDrawer, closeDrawer }), [openDrawer, closeDrawer]);

  const { drawerProps, drawerPanelContent } = drawerSettings;

  return (
    <AppDrawerContext.Provider value={contextValue}>
      <Drawer {...drawerProps}>
        <DrawerContent panelContent={drawerPanelContent}>
          <DrawerContentBody className="app-drawer-body">{children}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </AppDrawerContext.Provider>
  );
};
