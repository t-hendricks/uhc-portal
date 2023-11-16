/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Text,
  Title,
  Spinner,
  TextVariants,
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
import { ViewSorting } from '~/types/types';
import './LogTable.scss';
import ExternalLink from '~/components/common/ExternalLink';

import MarkdownParser from '~/common/MarkdownParser';
import { eventTypes } from '../../clusterDetailsHelper';

const columns = [
  {
    title: 'Description',
    sortTitle: 'summary',
  },
  {
    title: 'Type',
    sortTitle: 'log_type',
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
  <Tbody>
    <Tr>
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
    </Tr>
  </Tbody>
);

type LogType = ClusterLog & { id: string; doc_references?: Array<string> };

type LogTableParams = {
  pending: boolean;
  refreshEvent: {
    type: string;
    reset: () => void;
  };
  logs?: any[];
  setSorting: (sort: ViewSorting) => void;
};

const LogTable = ({ logs, setSorting, pending, refreshEvent }: LogTableParams) => {
  const [expandedLogs, setExpandedLogs] = React.useState<string[]>([]);
  const [forceHideSpinner, setForceHideSpinner] = React.useState(false);

  // initially sorted by Date descending
  const [sortColIndex, setSortColIndex] = React.useState(
    columns.findIndex((col) => col.sortTitle === 'timestamp') + 1,
  );
  const [sortDirection, setSortDirection] = React.useState(SortByDirection.desc);

  // keep showing logs data while refreshing
  React.useEffect(() => {
    if (!pending) {
      setForceHideSpinner(true);
      if (refreshEvent.type !== eventTypes.NONE) {
        refreshEvent.reset();
      }
    }
  }, [refreshEvent, pending]);

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
      log_type,
      doc_references: docReferences,
    } = log;

    const day = moment.utc(timestamp).format('D MMM YYYY, HH:mm UTC');

    const hasDocReferences = docReferences && docReferences.length > 0;

    const references = hasDocReferences ? (
      <>
        <Text
          data-testid={`references_${rowIndex}`}
          className="cluster-log__resources"
          component={TextVariants.h2}
        >
          <strong>References:</strong>
        </Text>
        <ul>
          {docReferences.map((url) => (
            <li key={url}>
              <ExternalLink href={url}>{url}</ExternalLink>
            </li>
          ))}
        </ul>
      </>
    ) : null;

    const isInternal = internal_only; // summary.trim() === 'INTERNAL';

    return (
      <Tbody className={isInternal ? 'pf-u-background-color-danger' : undefined} key={rowIndex}>
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
          <Td>{log_type}</Td>
          <Td>{severity}</Td>
          <Td>{username || createdBy}</Td>
          <Td>{day}</Td>
        </Tr>
        <Tr isExpanded={isLogExpanded(log)}>
          <Td className="cluster-log" colSpan={columns.length + 1}>
            <ExpandableRowContent>
              <MarkdownParser>{description}</MarkdownParser>
              {references}
            </ExpandableRowContent>
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
      const sorting: ViewSorting = {
        isAscending: direction === SortByDirection.asc,
        sortField: columns[index - 1].sortTitle,
        sortIndex: index,
      };
      setSorting(sorting);
      setSortColIndex(index);
      setSortDirection(sorting.isAscending ? SortByDirection.asc : SortByDirection.desc);
    },
    columnIndex,
  });

  const showSpinner = pending && (refreshEvent.type === eventTypes.NONE || !forceHideSpinner);

  return (
    <Bullseye>
      {showSpinner ? (
        <Spinner size="lg" />
      ) : (
        <TableComposable aria-label="Expandable table" variant={TableVariant.compact}>
          <Thead>
            <Tr>
              <Th />
              {columns.map((column, index) => (
                <Th sort={getSortParams(index + 1)} key={column.title}>
                  {column.title}
                </Th>
              ))}
            </Tr>
          </Thead>
          {logs?.length
            ? logs.map((log, index) => mapLog(log, index))
            : emptyState(columns.length + 1)}
        </TableComposable>
      )}
    </Bullseye>
  );
};

export default LogTable;
