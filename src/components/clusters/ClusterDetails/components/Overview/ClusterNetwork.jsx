import React from 'react';
import PropTypes from 'prop-types';

function ClusterNetwork({ cluster }) {
  return (
    cluster.managed && cluster.network && (
      <>
        <dt>Network</dt>
        <dd>
          { cluster.network.machine_cidr
         && (
         <dl className="cluster-details-item-list">
           <dt>Machine CIDR: </dt>
           <dd>{cluster.network.machine_cidr}</dd>
         </dl>
         )}
          { cluster.network.service_cidr
          && (
          <dl className="cluster-details-item-list">
            <dt>Service CIDR: </dt>
            <dd>{cluster.network.service_cidr}</dd>
          </dl>
          )}
          { cluster.network.pod_cidr
          && (
          <dl className="cluster-details-item-list">
            <dt>Pod CIDR: </dt>
            <dd>{cluster.network.pod_cidr}</dd>
          </dl>
          )}
          { cluster.network.host_prefix
          && (
          <dl className="cluster-details-item-list left">
            <dt>Host Prefix: </dt>
            <dd>{cluster.network.host_prefix}</dd>
          </dl>
          )}
        </dd>
      </>
    )
  );
}

ClusterNetwork.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterNetwork;
