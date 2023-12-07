import './TreeViewSelect.scss';
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import {
  Dropdown,
  MenuToggle,
  Switch,
  Stack,
  StackItem,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TreeView,
  TreeViewDataItem,
  TreeViewSearch,
} from '@patternfly/react-core';

export interface TreeViewData extends TreeViewDataItem {
  category?: string;
  descriptionLabel?: string;
  nameLabel?: string;
  id?: string;
  children?: TreeViewData[];
}

interface TreeViewSelectProps {
  treeViewSelectionMap: TreeViewData[];
  treeViewSwitchActive: boolean;
  setTreeViewSwitchActive: React.Dispatch<React.SetStateAction<boolean>>;
  includeFilterSwitch?: boolean;
  selected: string;
  inModal?: boolean;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  setSelected: (
    event: React.MouseEvent<Element, MouseEvent>,
    selection: TreeViewData | TreeViewDataItem,
  ) => void;
  placeholder?: string;
  switchLabelOn?: string;
  switchLabelOff?: string;
  searchPlaceholder?: string;
}

export function TreeViewSelectMenuItem(props: { name: string; description: string }) {
  const { name, description } = props;
  return (
    <div>
      <Stack>
        <StackItem>{name}</StackItem>
        <StackItem>
          <TextContent>
            <Text component="small">{description}</Text>
          </TextContent>
        </StackItem>
      </Stack>
    </div>
  );
}

export function TreeViewSelect(props: TreeViewSelectProps) {
  const {
    includeFilterSwitch,
    setSelected,
    selected,
    treeViewSelectionMap,
    treeViewSwitchActive,
    setTreeViewSwitchActive,
    placeholder,
    menuAppendTo,
    inModal,
    searchPlaceholder,
    switchLabelOn,
    switchLabelOff,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(treeViewSelectionMap);

  useEffect(() => {
    setFilteredItems(treeViewSelectionMap);
  }, [treeViewSelectionMap]);

  // remove with PF5 update
  useEffect(() => {
    if (isOpen && filteredItems.length) {
      const treeViewButtons = document.querySelectorAll('button.pf-c-tree-view__node');
      treeViewButtons.forEach((treeViewButton) => {
        treeViewButton.setAttribute('type', 'button');
      });
    }
    if (!isOpen) {
      setFilteredItems(treeViewSelectionMap);
    }
  }, [isOpen, filteredItems, treeViewSelectionMap]);

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value === '') {
      setFilteredItems(treeViewSelectionMap);
    } else {
      const filtered = treeViewSelectionMap
        .map((categoryObject) => {
          if (categoryObject.children) {
            const fuse = new Fuse<TreeViewData>(categoryObject.children, {
              keys: ['id', 'category', 'descriptionLabel', 'nameLabel'],
              shouldSort: true,
              findAllMatches: true,
              threshold: 0.1,
              ignoreLocation: true,
              distance: 100,
              minMatchCharLength: 1,
            });
            const filteredMachineCategory = fuse
              .search(evt.target.value.trim())
              .map(({ item }) => item);
            if (filteredMachineCategory.length > 0) {
              return {
                ...categoryObject,
                children: filteredMachineCategory,
              };
            }
          }
          return undefined;
        })
        .filter(Boolean) as TreeViewData[];
      setFilteredItems(filtered);
    }
  };

  const toolbar = (
    <Toolbar style={{ padding: 0 }}>
      <ToolbarContent style={{ padding: 0 }}>
        {includeFilterSwitch && (
          <ToolbarItem
            widths={{ default: '100%' }}
            className="pf-u-pt-xs pf-u-pb-sm pf-u-pl-md pf-u-pr-sm"
          >
            <Switch
              id="simple-switch"
              data-testid="simple-switch"
              label={switchLabelOn}
              labelOff={switchLabelOff}
              isChecked={treeViewSwitchActive}
              onChange={() => {
                setTreeViewSwitchActive(!treeViewSwitchActive);
              }}
            />
          </ToolbarItem>
        )}
        <ToolbarItem widths={{ default: '100%' }}>
          <TreeViewSearch
            className="pf-u-pt-sm pf-u-pb-sm pf-u-pl-sm pf-u-pr-sm"
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            id="input-search"
            name="search-input"
            aria-label="Search input"
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
  // close dropdown only if mousedown occurs outside parent element
  const dropdownElement = document.querySelector('#tree-view-dropdown') as Node;
  document.addEventListener('mousedown', (event) => {
    if (dropdownElement && !dropdownElement?.contains(event?.target as Node)) {
      setIsOpen(false);
    }
  });
  return (
    <Dropdown
      id="tree-view-dropdown"
      aria-label="Options menu"
      menuAppendTo={menuAppendTo}
      placeholder={placeholder}
      className={inModal ? 'tree-view-select-in-modal' : 'tree-view-select'}
      toggle={
        <MenuToggle
          aria-label="TreeViewSelect toggle"
          isFullWidth
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          {selected ? `${selected}` : `${placeholder}`}
        </MenuToggle>
      }
      isOpen={isOpen}
      style={{
        width: '70em',
      }}
    >
      {toolbar}
      <TreeView
        onSelect={(event, newItem) => {
          if (newItem.id && !newItem?.children) {
            setSelected(event, newItem);
            setIsOpen(false);
          }
        }}
        hasSelectableNodes={false}
        data={filteredItems}
        useMemo
      />
    </Dropdown>
  );
}
