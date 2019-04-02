import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';

function ClusterNetwork({ cluster, routerShards }) {
  const hasRouterShards = (routerShards
        && result(routerShards, 'routerShards.id') === cluster.id
        && result(routerShards, 'routerShards.items', false));

  const routerShardList = hasRouterShards && routerShards.routerShards.items.map(routerShard => (
    <li key={routerShard.id}>
      <dt>{`${routerShard.label}: `}</dt>
      <dd>{routerShard.scheme === 'internal' ? 'Internal' : 'External'}</dd>
    </li>
  ));

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
        { hasRouterShards
          && (
          <dl className="cluster-details-item-list left">
            <dt>Router Shards: </dt>
            <dd>
              <ul>{routerShardList}</ul>
            </dd>
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
  routerShards: PropTypes.object.isRequired,
};

export default ClusterNetwork;
