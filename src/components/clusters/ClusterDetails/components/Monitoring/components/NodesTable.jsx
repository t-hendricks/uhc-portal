import React from 'react';
import PropTypes from 'prop-types';

import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { monitoringItemLinkProps, monitoringItemTypes } from '../monitoringHelper';

function NodesTable({ nodes = [], clusterConsole }) {
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
    const nodeKey = node.hostname;
    const nodeUpStatus = nodeStatus(node.up);
    const nodeIpAddress = `Internal IP: ${node.internal_ip}`;

    return {
      nodeName,
      nodeUpStatus,
      nodeIpAddress,
      nodeKey,
    };
  });

  return (
    <Table variant={TableVariant.compact} borders={false} aria-label="nodes">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Node address</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.nodeKey}>
            <Td>{row.nodeName}</Td>
            <Td>{row.nodeUpStatus}</Td>
            <Td>{row.nodeIpAddress}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

NodesTable.propTypes = {
  nodes: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default NodesTable;
