import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';

import Timestamp from '../../../../common/Timestamp';

function DetailsLeft({ cluster, cloudProviders }) {
  const cloudProviderId = cluster.cloud_provider ? cluster.cloud_provider.id : null;
  let cloudProvider;
  let region = result(cluster, 'region.id', 'N/A');

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
          {cluster.external_id || 'N/A'}
        </dd>
        <dt>Location</dt>
        <dd>
          {region}
        </dd>
        <dt>Provider</dt>
        <dd>
          {cloudProvider}
        </dd>
        <dt>Version</dt>
        <dd>
          <dl className="cluster-details-item-list left">
            <dt>
              OpenShift:
              {' '}
            </dt>
            <dd>
              {cluster.openshift_version || 'N/A'}
            </dd>
          </dl>
        </dd>
        <dt>Created at</dt>
        <dd>
          <Timestamp value={cluster.creation_timestamp || ''} />
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
