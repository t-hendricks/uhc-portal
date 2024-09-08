import React, { ReactNode } from 'react';

import {
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
} from '@patternfly/react-core';

import { DrawerPanelContentNode } from './DrawerPanelContent';

type DrawerPanelProps = {
  title?: string;
  content?: DrawerPanelContentNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const DrawerPanel = ({ children, title, content, isOpen, onClose }: DrawerPanelProps) => (
  <Drawer isExpanded={isOpen} isInline>
    <DrawerContent
      panelContent={
        <DrawerPanelContent isResizable defaultSize="461px" minSize="417px">
          <DrawerHead>
            {content?.head}
            <DrawerActions>
              <DrawerCloseButton onClick={onClose} data-testid="drawer-close-button" />
            </DrawerActions>
          </DrawerHead>
          <Divider component="div" data-testid="drawer-panel-divider" />
          <DrawerContentBody>{content?.body}</DrawerContentBody>
        </DrawerPanelContent>
      }
    >
      <DrawerContentBody>{children}</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);

export default DrawerPanel;
