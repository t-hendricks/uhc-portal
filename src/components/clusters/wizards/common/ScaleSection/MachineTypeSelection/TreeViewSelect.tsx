import './TreeViewSelect.scss';
import React, { useState, useEffect } from 'react';

import {
  Dropdown,
  MenuToggle,
  Switch,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TreeView,
  TreeViewDataItem,
  TreeViewSearch,
} from '@patternfly/react-core';

export interface TreeViewData extends TreeViewDataItem {
  searchLabel: string;
  children: TreeViewData[];
}

interface TreeViewSelectProps {
  machineTypeMap: TreeViewData[];
  isMachineTypeFilteredByRegion: boolean;
  setIsMachineTypeFilteredByRegion: React.Dispatch<React.SetStateAction<boolean>>;
  selected: string;
  inModal: boolean;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  setSelected: (
    event: React.MouseEvent<Element, MouseEvent>,
    selection: TreeViewData | TreeViewDataItem,
  ) => void;
  placeholder?: string;
}

export function TreeViewSelect(props: TreeViewSelectProps) {
  const {
    setSelected,
    selected,
    machineTypeMap,
    isMachineTypeFilteredByRegion,
    setIsMachineTypeFilteredByRegion,
    placeholder,
    menuAppendTo,
    inModal,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [_, setIsFiltered] = useState(false);
  const [filteredItems, setFilteredItems] = useState(machineTypeMap);

  useEffect(() => {
    setFilteredItems(machineTypeMap);
  }, [machineTypeMap]);

  useEffect(() => {
    if (isOpen && filteredItems.length) {
      const treeViewButtons = document.querySelectorAll('button.pf-c-tree-view__node');
      treeViewButtons.forEach((treeViewButton) => {
        treeViewButton.setAttribute('type', 'button');
      });
    }
  }, [isOpen, filteredItems]);

  const filterItems = (item: TreeViewData, input: string): boolean => {
    if (item.children) {
      return item.children.filter((child) => filterItems(child, input)).length > 0;
    }
    if (item.searchLabel.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }
    return false;
  };

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const input = evt.target.value;
    if (input === '') {
      setFilteredItems(machineTypeMap);
      setIsFiltered(false);
    } else {
      const filtered = machineTypeMap.filter((item: TreeViewData) => filterItems(item, input));
      setFilteredItems(filtered);
      setIsFiltered(true);
    }
  };

  const toolbar = (
    <Toolbar style={{ padding: 0 }}>
      <ToolbarContent style={{ padding: 0 }}>
        <ToolbarItem widths={{ default: '100%' }} className="pf-u-pl-sm">
          <Switch
            id="simple-switch"
            label="Show compatible instances only"
            labelOff="Show compatible instances only"
            isChecked={isMachineTypeFilteredByRegion}
            onChange={(_, event) => {
              setIsMachineTypeFilteredByRegion(!isMachineTypeFilteredByRegion);
            }}
          />
        </ToolbarItem>
        <ToolbarItem widths={{ default: '100%' }}>
          <TreeViewSearch
            onSearch={onSearch}
            id="input-search"
            name="search-input"
            aria-label="Search input example"
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

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
      <TreeView
        onSelect={(event, newItem) => {
          if (newItem.id && !newItem?.children) {
            setSelected(event, newItem);
            setIsOpen(false);
          }
        }}
        hasSelectableNodes={false}
        data={filteredItems}
        toolbar={toolbar}
        useMemo
      />
    </Dropdown>
  );
}
