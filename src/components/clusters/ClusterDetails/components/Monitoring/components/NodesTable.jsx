import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableHeader as TableHeaderDeprecated,
  TableBody as TableBodyDeprecated,
} from '@patternfly/react-table/deprecated';

import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
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
    <TableDeprecated
      variant={TableVariant.compact}
      borders={false}
      cells={columns}
      rows={rows}
      aria-label="nodes"
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
  );
}

NodesTable.propTypes = {
  nodes: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default NodesTable;
