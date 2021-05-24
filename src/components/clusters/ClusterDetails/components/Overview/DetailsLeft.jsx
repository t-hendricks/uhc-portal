import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';

import Timestamp from '../../../../common/Timestamp';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
import BillingModelLabel from '../../../common/BillingModelLabel';
import InfrastructureModelLabel from '../../../common/InfrastructureModelLabel';
import ClusterVersionInfo from './ClusterVersionInfo';

function DetailsLeft({ cluster, cloudProviders }) {
  const cloudProviderId = cluster.cloud_provider ? cluster.cloud_provider.id : null;
  let cloudProvider;
  const region = get(cluster, 'region.id', 'N/A');

  if (cloudProviderId && cloudProviders.fulfilled && cloudProviders.providers[cloudProviderId]) {
    cloudProvider = cloudProviders.providers[cloudProviderId].display_name || 'N/A';
  } else {
    cloudProvider = cloudProviderId ? cloudProviderId.toUpperCase() : 'N/A';
  }

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
          <DescriptionListDescription>
            {get(cluster, 'external_id', 'N/A')}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Type
          </DescriptionListTerm>
          <DescriptionListDescription>
            <ClusterTypeLabel cluster={cluster} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Region</DescriptionListTerm>
          <DescriptionListDescription>
            {region}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Provider</DescriptionListTerm>
          <DescriptionListDescription>
            {cloudProvider}
          </DescriptionListDescription>
        </DescriptionListGroup>
        {cluster.managed
          && (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Availability</DescriptionListTerm>
                <DescriptionListDescription>
                  {cluster.multi_az ? 'Multizone' : 'Single zone'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
        <DescriptionListGroup>
          <DescriptionListTerm>Version</DescriptionListTerm>
          <DescriptionListDescription>
            <ClusterVersionInfo cluster={cluster} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created at</DescriptionListTerm>
          <DescriptionListDescription>
            <Timestamp value={get(cluster, 'creation_timestamp', 'N/A')} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>
            {get(cluster, 'subscription.creator.name') || get(cluster, 'subscription.creator.username', 'N/A')}
          </DescriptionListDescription>
        </DescriptionListGroup>
        {cluster.managed && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Subscription type
              </DescriptionListTerm>
              <DescriptionListDescription>
                <BillingModelLabel cluster={cluster} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Infrastructure type
              </DescriptionListTerm>
              <DescriptionListDescription>
                <InfrastructureModelLabel cluster={cluster} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
      </DescriptionList>
    </>
  );
}

DetailsLeft.propTypes = {
  cluster: PropTypes.any,
  cloudProviders: PropTypes.object.isRequired,
};

export default DetailsLeft;
