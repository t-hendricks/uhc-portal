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
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

const getIdFields = (cluster, showAssistedId) => {
  let label = 'Cluster ID';
  let id = get(cluster, 'external_id', 'N/A');

  const assistedId = get(cluster, 'aiCluster.id', 'N/A');
  if (showAssistedId && assistedId) {
    label = `Assisted cluster ID / ${label}`;
    id = `${assistedId} / ${id}`;
  }
  return { id, idLabel: label };
};
function DetailsLeft({ cluster, cloudProviders, showAssistedId }) {
  const cloudProviderId = cluster.cloud_provider ? cluster.cloud_provider.id : null;
  const region = get(cluster, 'region.id', 'N/A');
  const planType = get(cluster, 'subscription.plan.type');
  const isROSA = planType === normalizedProducts.ROSA;

  let cloudProvider;
  if (cloudProviderId && cloudProviders.fulfilled && cloudProviders.providers[cloudProviderId]) {
    cloudProvider = cloudProviders.providers[cloudProviderId].display_name || 'N/A';
  } else {
    cloudProvider = cloudProviderId ? cloudProviderId.toUpperCase() : 'N/A';
  }

  const { id, idLabel } = getIdFields(cluster, showAssistedId);
  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>{idLabel}</DescriptionListTerm>
          <DescriptionListDescription>
            {id}
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
        {!isROSA && (
          <DescriptionListGroup>
            <DescriptionListTerm>Provider</DescriptionListTerm>
            <DescriptionListDescription>
              {cloudProvider}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {cluster.managed
          && (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Availability</DescriptionListTerm>
                <DescriptionListDescription>
                  {cluster.multi_az ? 'Multi-zone' : 'Single zone'}
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
        {cluster.managed && !isROSA && (
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
  showAssistedId: PropTypes.bool.isRequired,
};

export default DetailsLeft;
