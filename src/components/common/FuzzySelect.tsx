import Fuse from 'fuse.js';
import React, { ReactElement, useCallback, ChangeEvent, useMemo, useRef, useEffect } from 'react';
import { KeyTypes, Select, SelectGroup, SelectOption, SelectProps } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

export type FuzzyEntryType = {
  key: string;
  groupKey?: string;
  value?: any;
  description?: string;
};
export type FuzzyDataType = FuzzyEntryType[] | Record<string, FuzzyEntryType[]>;
export interface FuzzySelectProps extends Omit<SelectProps, 'isGrouped'> {
  fuzziness?: number;
  selected?: string;
  sortFn?: (a: FuzzyEntryType, b: FuzzyEntryType) => number;
  filterValidate?: { pattern: RegExp; message: string };
  truncation?: number;
  selectionData: FuzzyDataType;
}

function truncateSelected(selected: string, truncation?: number) {
  if (truncation && selected && selected.length > truncation) {
    return `${selected.slice(0, truncation / 3)}... ${selected.slice((-truncation * 2) / 3)}`;
  }
  return selected;
}

function FuzzySelect(props: FuzzySelectProps) {
  const {
    fuzziness,
    selected = '',
    sortFn = (a: FuzzyEntryType, b: FuzzyEntryType): number => a.key.localeCompare(b.key),
    filterValidate,
    truncation,
    selectionData,
    isOpen,
  } = props;

  // const [isInnerOpen, setIsInnerOpen] = useState(false);
  const ref = useRef<Select>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        // Patternfly's inline filter up/down arrow keys are captured and used for navigating the options
        // unfortunately it also captures left/right which means you can't move the caret around your filter input text
        // this code grabs left/right arrows before they bubble up to the input and PF kills them
        // fix request: https://github.com/patternfly/patternfly-react/issues/9404
        const input = containerRef.current.getElementsByClassName(
          'pf-c-form-control pf-m-search',
        )?.[0] as HTMLInputElement;
        input.onkeydown = (e) => {
          if (e.key === KeyTypes.ArrowLeft || e.key === KeyTypes.ArrowRight) {
            e.stopPropagation();
          }
        };
      }
    } else if (ref.current) {
      ref.current?.onClose();
    }
  }, [isOpen]);

  const { selectionList, isGrouped } = useMemo<{
    selectionList: FuzzyEntryType[];
    isGrouped: boolean;
  }>(() => {
    if (Array.isArray(selectionData)) {
      return { selectionList: selectionData as FuzzyEntryType[], isGrouped: false };
    }
    let allLists: FuzzyEntryType[] = [];
    Object.entries(selectionData || {}).forEach(([_group, list]) => {
      allLists = [...allLists, ...list];
    });
    return { selectionList: allLists, isGrouped: true };
  }, [selectionData]);

  const selectOptions = useMemo<ReactElement[]>(() => {
    if (Array.isArray(selectionData)) {
      return selectionData.sort(sortFn).map(({ key, value, description }) => (
        <SelectOption
          className="pf-c-dropdown__menu-item"
          key={key}
          value={value || key}
          description={description}
        >
          {key}
        </SelectOption>
      ));
    }
    return Object.entries(selectionData || {})
      .sort(([groupa], [groupb]) => groupa.localeCompare(groupb))
      .map(([group, list]) => (
        <SelectGroup label={group} key={group}>
          {list.map(({ key, value, description }) => (
            <SelectOption value={value || key} key={key} description={description}>
              {key}
            </SelectOption>
          ))}
        </SelectGroup>
      ));
  }, [selectionData]);

  const onFilter = useCallback(
    (_: ChangeEvent<HTMLInputElement> | null, text: string) => {
      if (text === '') {
        return selectOptions;
      }
      // feature requested: https://github.com/patternfly/patternfly-react/issues/9407
      if (filterValidate) {
        if (filterValidate.pattern.test(text)) {
          return [
            <SelectOption
              isDisabled
              key={0}
              style={{ color: 'var(--pf-global--danger-color--100)' }}
              isNoResultsOption
            >
              <div>
                <span className="pf-u-mr-sm">
                  <ErrorCircleOIcon />
                </span>
                <span>{filterValidate.message}</span>
              </div>
            </SelectOption>,
          ];
        }
      }
      // create filtered map and sort by relevance
      const filterText = text.toLowerCase();
      const fuse = new Fuse(selectionList, {
        ignoreLocation: true,
        threshold: fuzziness || 0.3,
        includeScore: true,
        includeMatches: true,
        keys: ['key'],
      });
      const valueMap: Record<string, any> = {};
      const matchedList: Array<Record<string, Array<string | ReactElement>>> = [];
      const matchedMap: Record<string, Array<Record<string, Array<string | ReactElement>>>> = {};
      fuse
        .search<FuzzyEntryType>(filterText)
        // most relevent towards top, then by number
        .sort(
          ({ score: ax = 0, item: itema }, { score: bx = 0, item: itemb }) =>
            ax - bx || sortFn(itema, itemb),
        )
        .forEach(({ item, matches }) => {
          if (item) {
            if (item.key && matches) {
              let pos = 0;
              const itemId = item.key;
              valueMap[itemId] = item.value || itemId;
              const slicedId: Array<string | ReactElement> = [];
              if (item.groupKey) {
                if (matchedMap[item.groupKey]) {
                  matchedMap[item.groupKey].push({
                    [item.key]: slicedId,
                  });
                } else {
                  matchedMap[item.groupKey] = [
                    {
                      [item.key]: slicedId,
                    },
                  ];
                }
              } else {
                matchedList.push({
                  [item.key]: slicedId,
                });
              }

              // highlight matches in boldface
              const arr = itemId.split(filterText);
              if (arr.length > 1) {
                // if exact matches
                arr.forEach((seg, inx) => {
                  slicedId.push(seg);
                  if (inx < arr.length - 1) slicedId.push(<b>{filterText}</b>);
                });
              } else {
                // fuzzy matches
                matches[0].indices
                  .filter(([beg, end]) => end - beg > 0)
                  .forEach(([beg, end]) => {
                    slicedId.push(itemId.slice(pos, beg));
                    slicedId.push(<b>{itemId.slice(beg, end + 1)}</b>);
                    pos = end + 1;
                  });
                if (pos < itemId.length) {
                  slicedId.push(itemId.slice(pos));
                }
              }
            }
          }
        });
      // create filtered select options
      if (matchedList.length) {
        return matchedList.map((entry) => (
          <SelectOption
            className="pf-c-dropdown__menu-item"
            key={Object.keys(entry)[0]}
            value={valueMap[Object.keys(entry)[0]]}
          >
            {Object.values(entry)}
          </SelectOption>
        ));
      }
      // create filtered grouped select options
      return Object.entries(matchedMap).map(([groupKey, list]) => (
        <SelectGroup label={groupKey} key={groupKey}>
          {list.map((entry) => (
            <SelectOption
              className="pf-c-dropdown__menu-item"
              key={Object.keys(entry)[0]}
              value={valueMap[Object.keys(entry)[0]]}
            >
              {Object.values(entry)}
            </SelectOption>
          ))}
        </SelectGroup>
      ));
    },
    [selectionList, selectionData, selectOptions],
  );

  return (
    <div ref={containerRef}>
      <Select
        {...props}
        isOpen={isOpen}
        onFilter={onFilter}
        selections={truncateSelected(selected, truncation)}
        ref={ref}
        hasInlineFilter
        isGrouped={isGrouped}
      >
        {selectOptions}
      </Select>
    </div>
  );
}

export default FuzzySelect;
