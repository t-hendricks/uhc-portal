import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

import {
  MenuContainer,
  MenuToggle,
  Panel,
  PanelMain,
  PanelMainBody,
  Stack,
  StackItem,
  Switch,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TreeView,
  TreeViewDataItem,
  TreeViewSearch,
} from '@patternfly/react-core';

import './TreeViewSelect.scss';

export interface TreeViewData extends TreeViewDataItem {
  category?: string;
  descriptionLabel?: string;
  nameLabel?: string;
  id?: string;
  children?: TreeViewData[];
  sortingScore?: number;
}

interface TreeViewSelectProps {
  treeViewSelectionMap: TreeViewData[];
  treeViewSwitchActive: boolean;
  setTreeViewSwitchActive: React.Dispatch<React.SetStateAction<boolean>>;
  includeFilterSwitch?: boolean;
  selected: string;
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
    searchPlaceholder,
    switchLabelOnText,
    switchLabelOffText,
    ariaLabel,
    allExpanded = false,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(treeViewSelectionMap);
  const [searchString, setSearchString] = useState('');
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const searchFn = useCallback(() => {
    if (searchString === '') {
      setFilteredItems(treeViewSelectionMap);
    } else {
      const filtered = treeViewSelectionMap
        .map((categoryObject) => {
          if (categoryObject.children) {
            let lowestScore = 1;
            const fuse = new Fuse<TreeViewData>(categoryObject.children, {
              keys: ['id', 'category', 'descriptionLabel', 'nameLabel'],
              shouldSort: true,
              threshold: 0.3,
              includeScore: true,
              ignoreLocation: true,
              minMatchCharLength: 1,
            });

            const filteredMachineCategory = fuse
              .search(searchString.trim())
              .map(({ item, score }) => {
                if (score && score < lowestScore) lowestScore = score;
                return item;
              });
            if (filteredMachineCategory.length > 0) {
              return {
                ...categoryObject,
                children: filteredMachineCategory,
                sortingScore: lowestScore,
              };
            }
          }
          return undefined;
        })
        .filter(Boolean) as TreeViewData[];
      filtered.sort(
        (TreeViewNodeA, TreeViewNodeB) =>
          (TreeViewNodeA.sortingScore || Infinity) - (TreeViewNodeB.sortingScore || Infinity),
      );
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

  const toggle = (
    <MenuToggle
      ref={toggleRef}
      aria-label={ariaLabel && `${ariaLabel} toggle`}
      style={{ maxWidth: 'none', width: '100%' }}
      onClick={(e) => {
        setSearchString('');
        setIsOpen(!isOpen);
      }}
      isExpanded={isOpen}
    >
      {selected ? `${selected}` : `${placeholder}`}
    </MenuToggle>
  );

  const menu = (
    <Panel
      ref={menuRef}
      isScrollable
      variant="raised"
      style={{
        maxHeight: '60%',
        height: 'auto',
        overflow: 'auto',
      }}
    >
      <PanelMain
        style={{
          maxHeight: '100%',
        }}
      >
        <section>
          <PanelMainBody style={{ padding: 0 }}>
            <TreeView
              className="tree-view-custom-class"
              onSelect={(event, newItem) => {
                if (newItem.id && !newItem?.children) {
                  setSelected(event, newItem);
                  setIsOpen(false);
                }
              }}
              toolbar={toolbar}
              hasSelectableNodes={false}
              allExpanded={allExpanded || searchString !== ''}
              data={filteredItems}
              useMemo
            />
          </PanelMainBody>
        </section>
      </PanelMain>
    </Panel>
  );

  return (
    <MenuContainer
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onOpenChangeKeys={['Escape']}
      menu={menu}
      menuRef={menuRef}
      toggle={toggle}
      toggleRef={toggleRef}
    />
  );
}
