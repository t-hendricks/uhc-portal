import './TreeViewSelect.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import {
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
import {
  Dropdown as DropdownDeprecated,
  DropdownToggle as DropdownToggleDeprecated,
} from '@patternfly/react-core/deprecated';

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
  switchLabelOnText?: string;
  switchLabelOffText?: string;
  searchPlaceholder?: string;
  allExpanded?: boolean;
  ariaLabel?: string;
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
    switchLabelOnText,
    switchLabelOffText,
    ariaLabel,
    allExpanded = false,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(treeViewSelectionMap);
  const [searchString, setSearchString] = useState('');

  const searchFn = useCallback(() => {
    if (searchString === '') {
      setFilteredItems(treeViewSelectionMap);
    } else {
      const filtered = treeViewSelectionMap
        .map((categoryObject) => {
          if (categoryObject.children) {
            const fuse = new Fuse<TreeViewData>(categoryObject.children, {
              keys: ['id', 'category', 'descriptionLabel', 'nameLabel'],
              shouldSort: true,
              findAllMatches: true,
              threshold: 0.3,
              ignoreLocation: true,
              distance: 100,
              minMatchCharLength: 1,
            });
            const filteredMachineCategory = fuse
              .search(searchString.trim())
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
  }, [searchString, treeViewSelectionMap]);

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(evt.target.value);
    searchFn();
  };

  useEffect(() => {
    searchFn();
  }, [treeViewSelectionMap, searchFn]);

  const toolbar = (
    <Toolbar style={{ padding: 0 }}>
      <ToolbarContent style={{ padding: 0 }}>
        {includeFilterSwitch && (
          <ToolbarItem
            widths={{ default: '100%' }}
            className="pf-u-pt-xs pf-u-pb-sm pf-u-pl-md pf-u-pr-sm"
          >
            <Switch
              data-testid="display-switch"
              label={switchLabelOnText}
              labelOff={switchLabelOffText}
              isChecked={treeViewSwitchActive}
              onChange={() => {
                setTreeViewSwitchActive(!treeViewSwitchActive);
              }}
            />
          </ToolbarItem>
        )}
        <ToolbarItem widths={{ default: '100%' }}>
          <TreeViewSearch
            autoComplete="off"
            className="pf-u-pt-sm pf-u-pb-sm pf-u-pl-sm pf-u-pr-sm pf-u-w-inherit"
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            aria-label={ariaLabel && `${ariaLabel} search field`}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  // continue to use deprecated dropdown as menuAppendTo (deprecated) is being used elsewhere
  return (
    <DropdownDeprecated
      aria-label={ariaLabel}
      menuAppendTo={menuAppendTo}
      placeholder={placeholder}
      className={inModal ? 'tree-view-select-in-modal' : 'tree-view-select'}
      toggle={
        <DropdownToggleDeprecated
          aria-label={ariaLabel && `${ariaLabel} toggle`}
          style={{ maxWidth: 'none', width: '100%' }}
          onToggle={(e) => {
            setSearchString('');
            setIsOpen(!isOpen);
          }}
        >
          {selected ? `${selected}` : `${placeholder}`}
        </DropdownToggleDeprecated>
      }
      isOpen={isOpen}
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
        allExpanded={allExpanded || searchString !== ''}
        data={filteredItems}
        useMemo
      />
    </DropdownDeprecated>
  );
}
