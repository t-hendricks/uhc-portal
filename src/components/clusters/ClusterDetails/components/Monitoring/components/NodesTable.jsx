import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';

import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { monitoringItemLinkProps, monitoringItemTypes } from '../monitoringHelper';

function NodesTable({ nodes = [], clusterConsole }) {
  const columns = [{ title: 'Name' }, { title: 'Status' }, { title: 'Node address' }];

  const nodeStatus = (isUp) => {
    if (isUp) {
      return (
        <>
          <CheckCircleIcon className="status-icon success" />
          <span>Ready</span>
        </>
      );
    }
    return (
      <>
        <ExclamationCircleIcon className="status-icon danger" />
        <span>Not Ready</span>{' '}
      </>
    );
  };

  const rows = nodes.map((node) => {
    const nodeLinkProps = monitoringItemLinkProps(
      clusterConsole,
      monitoringItemTypes.NODE,
      node.hostname,
    );
    const nodeName =
      nodeLinkProps !== null ? <a {...nodeLinkProps}>{node.hostname}</a> : node.hostname;
    return {
      cells: [
        { title: nodeName },
        { title: nodeStatus(node.up) },
        { title: `Internal IP: ${node.internal_ip}` },
      ],
    };
  });

  return (
    <Table
      variant={TableVariant.compact}
      borders={false}
      cells={columns}
      rows={rows}
      aria-label="nodes"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

NodesTable.propTypes = {
  nodes: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default NodesTable;
