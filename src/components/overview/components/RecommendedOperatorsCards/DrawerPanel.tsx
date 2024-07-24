import React, { useRef, ReactNode } from 'react';

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

const DrawerPanel = ({ children, title, content, isOpen, onClose }: DrawerPanelProps) => {
  const drawerRef = useRef<any>();
  const onOpen = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  return (
    <Drawer isExpanded={isOpen} onExpand={onOpen} isInline={true}>
      <DrawerContent
        panelContent={
          <DrawerPanelContent isResizable defaultSize={'461px'} minSize={'417px'}>
            <DrawerHead>
              {content?.head}
              <DrawerActions>
                <DrawerCloseButton onClick={onClose} />
              </DrawerActions>
            </DrawerHead>
            <Divider component="div" />
            <DrawerContentBody>{content?.body}</DrawerContentBody>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerPanel;
