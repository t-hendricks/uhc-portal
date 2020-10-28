import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Timestamp from '../../../../common/Timestamp';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
import ClusterVersionInfo from './ClusterVersionInfo';


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

  let billingModel;
  if (get(cluster, 'product.id') === 'moa') {
    billingModel = 'Through AWS';
  } else if (get(cluster, 'ccs.enabled')) {
    billingModel = 'Customer cloud subscription';
  } else {
    billingModel = 'Standard';
  }

  return (
    <>
      <dl className="cluster-details-item">
        <dt>Cluster ID</dt>
        <dd>
          {get(cluster, 'external_id', 'N/A')}
        </dd>
        <dt>
          Type
        </dt>
        <dd>
          <ClusterTypeLabel cluster={cluster} />
        </dd>
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
            <>
              <dt>Availability</dt>
              <dd>
                {cluster.multi_az ? 'Multizone' : 'Single zone'}
              </dd>
            </>
          )}
        <dt>Version</dt>
        <dd>
          <ClusterVersionInfo cluster={cluster} />
        </dd>
        <dt>Created at</dt>
        <dd>
          <Timestamp value={get(cluster, 'creation_timestamp', 'N/A')} />
        </dd>
        <dt>Owner</dt>
        <dd>
          {get(cluster, 'subscription.creator.name') || get(cluster, 'subscription.creator.username', 'N/A')}
        </dd>
        {cluster.managed && (
          <>
            <dt>
              Billing model
            </dt>
            <dd>
              { billingModel }
            </dd>
          </>
        )}
      </dl>
    </>
  );
}

DetailsLeft.propTypes = {
  cluster: PropTypes.any,
  cloudProviders: PropTypes.object.isRequired,
};

export default DetailsLeft;
