import React, { ReactElement, useCallback, ChangeEvent, useMemo, useRef, useEffect } from 'react';
import { KeyTypes } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectGroup as SelectGroupDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectProps as SelectPropsDeprecated,
} from '@patternfly/react-core/deprecated';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/error-circle-o-icon';

import Fuse from 'fuse.js';

import { getIdSlices } from '~/common/fuzzyUtils';
import { truncateTextWithEllipsis } from '~/common/helpers';

export type FuzzyEntryType = {
  groupId?: string;
  entryId: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type FuzzyDataType = FuzzyEntryType[] | Record<string, FuzzyEntryType[]>;
export interface FuzzySelectProps extends Omit<SelectPropsDeprecated, 'isGrouped'> {
  fuzziness?: number;
  selectedEntryId?: string;
  sortFn?: (a: FuzzyEntryType, b: FuzzyEntryType) => number;
  filterValidate?: { pattern: RegExp; message: string }; // regex pattern that must be true, else message is shown
  truncation?: number;
  selectionData: FuzzyDataType;
}

const defaultSortFn = (a: FuzzyEntryType, b: FuzzyEntryType): number =>
  a.label.localeCompare(b.label);

// We cannot convert this function to a React component such as <FuzzySelectOption entry={entry} />,
// because Patternfly expects to find the props in entry (value, etc.) on the direct children of Select/SelectGroup
const entryToSelectOption = (entry: FuzzyEntryType, displayLabel: React.ReactElement) => (
  <SelectOptionDeprecated
    className="pf-v5-c-dropdown__menu-item pf-v5-u-text-wrap"
    key={entry.entryId}
    value={entry.entryId}
    description={entry.description}
    isDisabled={entry.disabled}
  >
    {displayLabel}
  </SelectOptionDeprecated>
);

/**
 * Creates the display label of a FuzzyEntry that matches the filter text
 * It splits the label in several parts, with the parts that match the filter text bolded.
 * @param props { entry, filterText} fuzzy select entry and filter text
 */
const FuzzyMatchName = ({ entry, filterText }: { entry: FuzzyEntryType; filterText: string }) => (
  <>
    {getIdSlices(entry.label, filterText).map((idSplit, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={`slice-${index}`} className={idSplit.isBold ? 'pf-u-font-weight-bold' : ''}>
        {idSplit.text}
      </span>
    ))}
  </>
);

function FuzzySelect(props: FuzzySelectProps) {
  const {
    fuzziness,
    selectedEntryId = '',
    sortFn = defaultSortFn,
    filterValidate,
    truncation, // if selected value above this # of characters, truncate selected
    selectionData,
    isOpen,
    toggleId,
    ...rest
  } = props;

  // const [isInnerOpen, setIsInnerOpen] = useState(false);
  const ref = useRef<SelectDeprecated>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        // Patternfly's inline filter up/down arrow keys are captured and used for navigating the options
        // unfortunately it also captures left/right which means you can't move the caret around your filter input text
        // this code grabs left/right arrows before they bubble up to the input and PF kills them
        // fix request: https://github.com/patternfly/patternfly-react/issues/9404
        const input = containerRef.current.querySelector(
          '.pf-v5-c-select__menu-search input',
        ) as HTMLInputElement;
        if (input) {
          input.onkeydown = (e) => {
            if (e.key === KeyTypes.ArrowLeft || e.key === KeyTypes.ArrowRight) {
              e.stopPropagation();
            }
          };
        }
      }
    } else if (ref.current) {
      ref.current?.onClose();
    }
  }, [isOpen]);

  const { selectionList, isGrouped, groupOrder } = useMemo<{
    selectionList: FuzzyEntryType[];
    groupOrder: string[];
    isGrouped: boolean;
  }>(() => {
    if (Array.isArray(selectionData)) {
      return { selectionList: selectionData as FuzzyEntryType[], isGrouped: false, groupOrder: [] };
    }
    let allLists: FuzzyEntryType[] = [];
    Object.entries(selectionData || {}).forEach(([_group, list]) => {
      allLists = [...allLists, ...list];
    });
    const groupOrder = Object.keys(selectionData) as string[];
    return { selectionList: allLists, isGrouped: true, groupOrder };
  }, [selectionData]);

  const selectOptions = useMemo<ReactElement[]>(() => {
    if (Array.isArray(selectionData)) {
      const sortedItems = selectionData.sort(sortFn);
      return sortedItems.map((entry) => {
        const entryLabel = truncateTextWithEllipsis(entry.label, truncation);
        return entryToSelectOption(entry, <>{entryLabel}</>);
      });
    }
    return Object.entries(selectionData || {}).map(([groupKey, groupEntries]) => (
      <SelectGroupDeprecated label={groupKey} key={groupKey}>
        {groupEntries.map((groupEntry) => {
          const entryLabel = truncateTextWithEllipsis(groupEntry.label, truncation);
          return entryToSelectOption(groupEntry, <>{entryLabel}</>);
        })}
      </SelectGroupDeprecated>
    ));
  }, [selectionData, sortFn, truncation]);

  const onFilter = useCallback(
    (_: ChangeEvent<HTMLInputElement> | null, text: string) => {
      if (text === '') {
        return selectOptions;
      }
      // feature requested: https://github.com/patternfly/patternfly-react/issues/9407
      if (filterValidate) {
        filterValidate.pattern.lastIndex = 0;
        if (!filterValidate.pattern.test(text)) {
          return [
            <SelectOptionDeprecated
              isDisabled
              key={0}
              style={{ color: 'var(--pf-v5-global--danger-color--100)' }}
              isNoResultsOption
            >
              <div>
                <span className="pf-v5-u-mr-sm">
                  <ErrorCircleOIcon />
                </span>
                <span>{filterValidate.message}</span>
              </div>
            </SelectOptionDeprecated>,
          ];
        }
      }
      // create filtered map and sort by relevance
      const filterText = text.toLowerCase();
      const threshold = selectionList.find(({ label }) => label === filterText)
        ? 0
        : fuzziness || 0.3;
      const fuse = new Fuse(selectionList, {
        ignoreLocation: true,
        threshold,
        includeScore: true,
        includeMatches: true,
        // Allow to search by ID and by label, although the display order is always by label
        keys: ['label', 'entryId'],
      });

      const fuseResult = fuse
        .search<FuzzyEntryType>(filterText)
        // most relevant towards top, then by number
        .sort(
          ({ score: ax = 0, item: itemA }, { score: bx = 0, item: itemB }) =>
            ax - bx || sortFn(itemA, itemB),
        );

      // First, add the matching entries to their corresponding map - grouped Select or ungrouped Select
      const matchedEntries: FuzzyEntryType[] = [];
      const matchedEntriesByGroup: Record<string, FuzzyEntryType[]> = {};

      let hasGroupEntries = false;
      fuseResult.forEach(({ item, matches }) => {
        if (item && !item.disabled && matches) {
          if (item.groupId) {
            hasGroupEntries = true;
            if (matchedEntriesByGroup[item.groupId]) {
              matchedEntriesByGroup[item.groupId].push(item);
            } else {
              matchedEntriesByGroup[item.groupId] = [item];
            }
          } else {
            matchedEntries.push(item);
          }
        }
      });

      // Finally, build the SelectOptions for the matching entries
      if (matchedEntries.length) {
        return matchedEntries.map((entry) =>
          entryToSelectOption(
            entry,
            <FuzzyMatchName key={entry.entryId} entry={entry} filterText={filterText} />,
          ),
        );
      }
      // For grouped Select, build the SelectGroup and SelectOption for the matches
      if (hasGroupEntries) {
        return Object.entries(matchedEntriesByGroup)
          .sort(([groupA], [groupB]) => groupOrder.indexOf(groupA) - groupOrder.indexOf(groupB))
          .map(([groupKey, groupEntries]) => (
            <SelectGroupDeprecated label={groupKey} key={groupKey}>
              {groupEntries.map((groupEntry) =>
                entryToSelectOption(
                  groupEntry,
                  <FuzzyMatchName
                    key={groupEntry.entryId}
                    entry={groupEntry}
                    filterText={filterText}
                  />,
                ),
              )}
            </SelectGroupDeprecated>
          ));
      }
      // No matches found
      return [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectionList, selectOptions, truncation],
  );

  return (
    <div ref={containerRef}>
      <SelectDeprecated
        isOpen={isOpen}
        onFilter={onFilter}
        selections={selectedEntryId}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
        ref={ref}
        hasInlineFilter
        isGrouped={isGrouped}
        toggleId={toggleId}
        {...rest}
      >
        {selectOptions}
      </SelectDeprecated>
    </div>
  );
}

export default FuzzySelect;
