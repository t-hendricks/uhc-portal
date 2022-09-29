import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import flatten from 'lodash/flatten';
import ReactMarkdown from 'react-markdown';

import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import {
  expandable,
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import './LogTable.scss';

const columns = [
  {
    title: 'Description',
    transforms: [sortable],
    cellFormatters: [expandable],
  },
  {
    title: 'Severity',
    transforms: [sortable],
  },
  {
    title: 'Logged by',
    transforms: [sortable],
  },
  {
    title: 'Date',
    transforms: [sortable],
  },
];

const sortColumns = {
  Description: 'summary',
  Date: 'timestamp',
  Severity: 'severity',
  'Logged by': 'username||created_by',
};

const emptyState = [
  {
    heightAuto: true,
    cells: [
      {
        props: { colSpan: 8, dataLabel: null },
        title: (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h2" size="lg">
                No results found
              </Title>
              <EmptyStateBody>
                No results match the filter criteria. Remove all filters or clear all filters to
                show results.
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        ),
      },
    ],
  },
];

const mapLog = (log, index) => {
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

  return [
    {
      // parent
      isOpen: false,
      cells: [summary, severity, username || createdBy, day],
      expandId: id,
    },
    {
      // child
      parent: index * 2,
      fullWidth: true,
      cells: [{ title: md }],
    },
  ];
};

class LogTable extends React.Component {
  constructor(props) {
    super(props);
    this.onCollapse = this.onCollapse.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  state = {
    rows: emptyState,
    // initially sorted by Date descending
    sortBy: {
      index: 4,
      direction: SortByDirection.desc,
    },
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { logs: newRows } = nextProps;
    if (typeof newRows === 'undefined') {
      return { rows: emptyState };
    }
    const { rows: oldRows } = state;
    const oldIds = oldRows.map((row) => row.expandId).filter((x) => x !== undefined);
    const newIds = newRows.map((row) => row.id);
    if (!isEqual(oldIds, newIds)) {
      const rows = newRows.length === 0 ? emptyState : flatten(newRows.map(mapLog));
      return { rows };
    }
    return null;
  }

  onCollapse(event, rowKey, isOpen) {
    const { rows } = this.state;
    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows,
    });
  }

  onSort(_event, index, direction) {
    const { setSorting } = this.props;
    const sorting = {
      isAscending: direction === SortByDirection.asc,
      sortField: sortColumns[columns[index - 1].title],
    };
    setSorting(sorting);
    this.setState({
      sortBy: {
        index,
        direction: sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
      },
    });
  }

  render() {
    const { rows, sortBy } = this.state;
    const { pending } = this.props;
    return (
      <Bullseye>
        {pending ? (
          <Spinner centered className="cluster-list-spinner" />
        ) : (
          <Table
            className="cluster-log"
            variant={TableVariant.compact}
            cells={columns}
            rows={rows}
            onCollapse={this.onCollapse}
            aria-label="Table of Logs"
            onSort={this.onSort}
            sortBy={sortBy}
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
      </Bullseye>
    );
  }
}

LogTable.propTypes = {
  logs: PropTypes.array,
  setSorting: PropTypes.func.isRequired,
  pending: PropTypes.bool,
};

export default LogTable;
