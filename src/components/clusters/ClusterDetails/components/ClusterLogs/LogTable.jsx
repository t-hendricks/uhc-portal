import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
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
  Tbody,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
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

const emptyState = (colSpan) => (
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

const LogTable = ({ logs, setSorting, pending }) => {
  const [expandedLogs, setExpandedLogs] = React.useState([]);

  // initially sorted by Date descending
  const [sortColIndex, setSortColIndex] = React.useState(
    columns.findIndex((col) => col.sortTitle === 'timestamp') + 1,
  );
  const [sortDirection, setSortDirection] = React.useState(SortByDirection.desc);

  const setLogExpanded = (log, isExpanding = true) => {
    const otherExpandedLogs = expandedLogs.filter((r) => r !== log.id);
    const newLogs = isExpanding ? [...otherExpandedLogs, log.id] : otherExpandedLogs;

    setExpandedLogs(newLogs);
  };

  const isLogExpanded = (log) => expandedLogs.includes(log.id);

  const mapLog = (log, rowIndex) => {
    const { id, summary, severity, timestamp, description, username, created_by: createdBy } = log;

    const day = moment.utc(timestamp).format('D MMM YYYY, HH:mm UTC');

    const md = (
      <ReactMarkdown
        className="markdown"
        source={description}
        linkTarget="_blank"
        renderers={{
          // eslint-disable-next-line react/prop-types
          linkReference: ({ href, $ref, children }) => {
            if (!href) {
              // eslint-disable-next-line react/prop-types
              return `[${children[0].props.value}]`;
            }

            return <a href={$ref}>{children}</a>;
          },
        }}
      />
    );

    return (
      <Tbody>
        <Tr>
          <Td
            expand={{
              rowIndex,
              isExpanded: isLogExpanded(log),
              onToggle: () => {
                setLogExpanded(log, !isLogExpanded(log));
              },
              expandId: id,
            }}
          />
          <Td>{summary}</Td>
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

  const getSortParams = (columnIndex) => ({
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

LogTable.propTypes = {
  logs: PropTypes.array,
  setSorting: PropTypes.func.isRequired,
  pending: PropTypes.bool,
};

export default LogTable;
