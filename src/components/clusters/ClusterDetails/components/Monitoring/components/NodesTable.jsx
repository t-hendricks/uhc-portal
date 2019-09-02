import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import { OkIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';

function NodesTable({ nodes = [] }) {
  const columns = [
    { title: 'Name' },
    { title: 'Status' },
    { title: 'Node address' },
  ];

  const nodeStatus = (status) => {
    if (status === 1) {
      return (
        <React.Fragment>
          <OkIcon className="status-icon" color={global_success_color_100.value} size="md" />
          <span>Ready</span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />
        <span>Not Ready</span>
        {' '}
      </React.Fragment>);
  };

  const rows = nodes.map(node => ([
    { title: node.node },
    { title: nodeStatus(node.up) },
    { title: `Internal IP: ${node.instance}` },
  ]));


  return (
    <Table variant={TableVariant.compact} borders={false} cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
}

NodesTable.propTypes = {
  nodes: PropTypes.array,
};

export default NodesTable;
