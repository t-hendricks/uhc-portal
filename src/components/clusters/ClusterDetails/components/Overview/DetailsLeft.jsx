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
  if (['moa', 'rosa'].includes(get(cluster, 'product.id'))) {
    billingModel = 'Through AWS';
  } else if (get(cluster, 'ccs.enabled')) {
    billingModel = 'Customer cloud subscription';
  } else {
    billingModel = 'Standard';
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
          <DescriptionListTerm>Location</DescriptionListTerm>
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
        { cluster.managed
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
                Billing model
              </DescriptionListTerm>
              <DescriptionListDescription>
                { billingModel }
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
