import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Timestamp from '../../../../common/Timestamp';
import ClusterUpdateLink from '../../../common/ClusterUpdateLink';

function DetailsLeft({ cluster, cloudProviders }) {
  const cloudProviderId = cluster.cloud_provider ? cluster.cloud_provider.id : null;
  let cloudProvider;
  let region = get(cluster, 'region.id', 'N/A');

  if (cloudProviderId && cloudProviders.fulfilled && cloudProviders.providers[cloudProviderId]) {
    const providerData = cloudProviders.providers[cloudProviderId];

    cloudProvider = providerData.display_name;
    if (providerData.regions[region]) {
      region = providerData.regions[region].display_name;
    }
  } else {
    cloudProvider = cloudProviderId ? cloudProviderId.toUpperCase() : 'N/A';
  }

  return (
    <React.Fragment>
      <dl className="cluster-details-item left">
        <dt>Cluster ID</dt>
        <dd>
          {get(cluster, 'external_id', 'N/A')}
        </dd>
        <dt>
          Type
        </dt>
        {
          cluster.managed ? (
            <dd>
              OSD
            </dd>
          ) : (
            <dd>
              OCP
            </dd>
          )
        }
        <dt>Location</dt>
        <dd>
          {region}
        </dd>
        <dt>Provider</dt>
        <dd>
          {cloudProvider}
        </dd>
        { cluster.managed
          && (
          <React.Fragment>
            <dt>Availability</dt>
            <dd>
              {cluster.multi_az ? 'Multizone' : 'Single zone'}
            </dd>
          </React.Fragment>
          )}
        <dt>Version</dt>
        <dd>
          <dl className="cluster-details-item-list left">
            <dt>
              OpenShift:
              {' '}
            </dt>
            <dd>
              {get(cluster, 'openshift_version', 'N/A')}
              <ClusterUpdateLink cluster={cluster} />
            </dd>
          </dl>
        </dd>
        <dt>Operating system</dt>
        <dd>
          {get(cluster, 'metrics.operating_system', 'N/A')}
        </dd>
        <dt>Created at</dt>
        <dd>
          <Timestamp value={get(cluster, 'creation_timestamp', 'N/A')} />
        </dd>
        <dt>Owner</dt>
        <dd>
          {get(cluster, 'subscription.creator.name') || get(cluster, 'subscription.creator.username', 'N/A')}
        </dd>
      </dl>
    </React.Fragment>
  );
}

DetailsLeft.propTypes = {
  cluster: PropTypes.any,
  cloudProviders: PropTypes.object.isRequired,
};

export default DetailsLeft;
