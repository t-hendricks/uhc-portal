import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';
import {
  OverlayTrigger,
  Tooltip,
} from 'patternfly-react';

function ClusterNetwork({ cluster, routerShards }) {
  const hasRouterShards = (routerShards && cluster.dns
        && result(routerShards, 'routerShards.id') === cluster.id
        && result(routerShards, 'routerShards.items', false));

  const routerShardList = hasRouterShards && routerShards.routerShards.items.map(routerShard => (
    <li key={routerShard.id}>
      <dt className="ellipsize">{`${routerShard.label}: `}</dt>
      <dd>
        <OverlayTrigger overlay={<Tooltip id="router-shard-scheme-tooltip">{`${routerShard.id}.apps.${cluster.name}.${cluster.dns.base_domain}`}</Tooltip>}>
          <span>{routerShard.scheme === 'internal' ? 'Internal' : 'External'}</span>
        </OverlayTrigger>
      </dd>
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
