/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  Spinner,
} from '@patternfly/react-core';

import {
  SortByDirection,
  TableVariant,
  TableComposable,
  Thead,
  Tr,
  Th,
  ThProps,
  Tbody,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table';

import { SearchIcon, WrenchIcon } from '@patternfly/react-icons';
import { ClusterLog } from '~/types/service_logs.v1/index';
import './LogTable.scss';

const columns = [
  {
    title: 'Description',
    sortTitle: 'summary',
  },
  {
    title: 'Severity',
    sortTitle: 'severity',
  },
  {
    title: 'Logged by',
    sortTitle: 'username||created_by',
  },
  {
    title: 'Date',
    sortTitle: 'timestamp',
  },
];

const emptyState = (colSpan: number) => (
  <Td colSpan={colSpan}>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h2" size="lg">
          No results found
        </Title>
        <EmptyStateBody>
          No results match the filter criteria. Remove all filters or clear all filters to show
          results.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </Td>
);

type LogType = ClusterLog & { id: string };

type SortParams = {
  isAscending: boolean;
  sortField: string;
};

type LogTableParams = {
  pending: boolean;
  logs: any[];
  setSorting: (sort: SortParams) => void;
};

const LogTable = ({ logs, setSorting, pending }: LogTableParams) => {
  const [expandedLogs, setExpandedLogs] = React.useState<string[]>([]);

  // initially sorted by Date descending
  const [sortColIndex, setSortColIndex] = React.useState(
    columns.findIndex((col) => col.sortTitle === 'timestamp') + 1,
  );
  const [sortDirection, setSortDirection] = React.useState(SortByDirection.desc);

  const setLogExpanded = (log: LogType, isExpanding = true) => {
    const otherExpandedLogs = expandedLogs.filter((r) => r !== log.id);
    const newLogs = isExpanding ? [...otherExpandedLogs, log.id] : otherExpandedLogs;

    setExpandedLogs(newLogs);
  };

  const isLogExpanded = (log: LogType) => expandedLogs.includes(log.id);

  const mapLog = (log: LogType, rowIndex: number) => {
    const {
      summary,
      severity,
      timestamp,
      description,
      username,
      created_by: createdBy,
      internal_only,
    } = log;

    const day = moment.utc(timestamp).format('D MMM YYYY, HH:mm UTC');

    const md = (
      <ReactMarkdown
        className="markdown"
        source={description}
        linkTarget="_blank"
        renderers={{
          // @ts-ignore
          linkReference: ({ href, $ref, children }) => {
            if (!href) {
              return `[${children[0].props.value}]`;
            }
            return <a href={$ref}>{children}</a>;
          },
        }}
      />
    );

    const isInternal = internal_only; // summary.trim() === 'INTERNAL';

    return (
      <Tbody className={isInternal ? 'pf-u-background-color-danger' : undefined}>
        <Tr>
          <Td
            expand={{
              rowIndex,
              isExpanded: isLogExpanded(log),
              onToggle: () => {
                setLogExpanded(log, !isLogExpanded(log));
              },
            }}
          />
          <Td>
            {summary} {isInternal ? <WrenchIcon /> : null}
          </Td>
          <Td>{severity}</Td>
          <Td>{username || createdBy}</Td>
          <Td>{day}</Td>
        </Tr>
        <Tr isExpanded={isLogExpanded(log)}>
          <Td colSpan={columns.length + 1}>
            <ExpandableRowContent>{md}</ExpandableRowContent>
          </Td>
        </Tr>
      </Tbody>
    );
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortColIndex,
      direction: sortDirection,
    },
    onSort: (_event, index, direction) => {
      const sorting = {
        isAscending: direction === SortByDirection.asc,
        sortField: columns[index - 1].sortTitle,
      };
      setSorting(sorting);
      setSortColIndex(index);
      setSortDirection(sorting.isAscending ? SortByDirection.asc : SortByDirection.desc);
    },
    columnIndex,
  });

  return (
    <Bullseye>
      {pending ? (
        <Spinner size="lg" />
      ) : (
        <TableComposable aria-label="Expandable table" variant={TableVariant.compact}>
          <Thead>
            <Tr>
              <Th />
              {columns.map((column, index) => (
                <Th sort={getSortParams(index + 1)}>{column.title}</Th>
              ))}
            </Tr>
          </Thead>
          {logs && logs.length > 0
            ? logs.map((log, index) => mapLog(log, index))
            : emptyState(columns.length + 1)}
        </TableComposable>
      )}
    </Bullseye>
  );
};

export default LogTable;
