import React from 'react';
import PropTypes from 'prop-types';

function ClusterNetwork({ cluster }) {
  return (
    cluster.managed && cluster.network && (
    <React.Fragment>
      <dt>Network</dt>
      <dd>
        { cluster.network.machine_cidr
         && (
         <dl className="cluster-details-item-list left">
           <dt>Machine CIDR: </dt>
           <dd>{cluster.network.machine_cidr}</dd>
         </dl>
         )
        }
        { cluster.network.service_cidr
          && (
          <dl className="cluster-details-item-list left">
            <dt>Service CIDR: </dt>
            <dd>{cluster.network.service_cidr}</dd>
          </dl>
          )
        }
        { cluster.network.pod_cidr
          && (
          <dl className="cluster-details-item-list left">
            <dt>Pod CIDR: </dt>
            <dd>{cluster.network.pod_cidr}</dd>
          </dl>
          )
        }
      </dd>
    </React.Fragment>
    )
  );
}

ClusterNetwork.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterNetwork;
