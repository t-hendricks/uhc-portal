import React, { useRef } from 'react';

import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
} from '@patternfly/react-core';

type DrawerPanelProps = {
  title?: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
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
          <DrawerPanelContent
            isResizable /* todo: Should I add these? defaultSize={'500px'} minSize={'150px'} */
          >
            <DrawerHead>
              <span tabIndex={isOpen ? 0 : -1} ref={drawerRef}>
                {title}
              </span>
              <DrawerActions>
                <DrawerCloseButton onClick={onClose} />
              </DrawerActions>
            </DrawerHead>
            <DrawerContentBody>{content}</DrawerContentBody>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerPanel;
