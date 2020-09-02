import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Timestamp from '../../../../common/Timestamp';
import ClusterUpdateLink from '../../../common/ClusterUpdateLink';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
import SupportStatusLabel from './SupportStatusLabel';


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
  const clusterVersion = get(cluster, 'openshift_version', 'N/A');
  const isUpgrading = get(cluster, 'metrics.upgrade.state') === 'running';
  const channel = get(cluster, 'metrics.channel');

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
          <dl className="cluster-details-item-list">
            <dt>
              OpenShift:
              {' '}
            </dt>
            <dd>
              {clusterVersion}
              <ClusterUpdateLink cluster={cluster} />
            </dd>
            { !cluster.managed && !isUpgrading && (
              <div>
                <dt>Life cycle state: </dt>
                <dd>
                  <SupportStatusLabel clusterVersion={clusterVersion} />
                </dd>
              </div>
            )}
            { channel && (
              <div>
                <dt>Upgrade channel: </dt>
                <dd>{channel}</dd>
              </div>
            )}
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
        {cluster.managed && (
          <>
            <dt>
              Billing model
            </dt>
            <dd>
              {cluster.byoc ? 'Customer cloud subscription' : 'Standard'}
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
