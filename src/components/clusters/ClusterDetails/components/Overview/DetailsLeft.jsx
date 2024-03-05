import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';

import getBillingModelLabel from '~/components/clusters/common/getBillingModelLabel';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import Timestamp from '../../../../common/Timestamp';
import PopoverHint from '../../../../common/PopoverHint';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
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
  const region = cluster?.region?.id;
  const planType = get(cluster, 'subscription.plan.type');
  const isROSA = planType === normalizedProducts.ROSA;
  const isHypershift = isHypershiftCluster(cluster);
  const isRHOIC = cluster?.subscription?.plan?.type === normalizedProducts.RHOIC;

  let cloudProvider;
  if (cloudProviderId && cloudProviders.fulfilled && cloudProviders.providers[cloudProviderId]) {
    cloudProvider = cloudProviders.providers[cloudProviderId].display_name || 'N/A';
  } else {
    cloudProvider = cloudProviderId ? cloudProviderId.toUpperCase() : 'N/A';
  }

  const { id, idLabel } = getIdFields(cluster, showAssistedId);
  const controlPlaneType = isHypershift ? 'Hosted' : 'Classic';
  const sharedVpcZoneId = get(cluster, 'aws.private_hosted_zone_id', false);

  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>{idLabel}</DescriptionListTerm>
        <DescriptionListDescription>
          <span data-testid="clusterID">{id}</span>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Type</DescriptionListTerm>
        <DescriptionListDescription>
          <ClusterTypeLabel cluster={cluster} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      {isHypershift && (
        <DescriptionListGroup>
          <DescriptionListTerm>Control plane type</DescriptionListTerm>
          <DescriptionListDescription data-testid="controlType">
            <span data-testid="controlPlaneType">{controlPlaneType}</span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {!isRHOIC || (isRHOIC && region) ? (
        <DescriptionListGroup>
          <DescriptionListTerm>Region</DescriptionListTerm>
          <DescriptionListDescription>
            <span data-testid="region">{region || 'N/A'}</span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      ) : null}
      {!isROSA && (
        <DescriptionListGroup>
          <DescriptionListTerm>Provider</DescriptionListTerm>
          <DescriptionListDescription>
            <span data-testid="provider">{cloudProvider}</span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {cluster.managed && (
        <DescriptionListGroup>
          <DescriptionListTerm>Availability</DescriptionListTerm>
          <DescriptionListDescription>
            <span data-testid="availability">
              {cluster.multi_az ? 'Multi-zone' : 'Single zone'}
            </span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      <DescriptionListGroup>
        <DescriptionListTerm>
          Version
          {isHypershift && (
            <PopoverHint
              iconClassName="pf-v5-u-ml-sm"
              hint="This version is only for the control plane. Worker nodes may have a different version."
            />
          )}
        </DescriptionListTerm>
        <DescriptionListDescription>
          <ClusterVersionInfo cluster={cluster} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      {!!sharedVpcZoneId && (
        <DescriptionListGroup>
          <DescriptionListTerm>Shared VPC hosted zone ID</DescriptionListTerm>
          <DescriptionListDescription>
            <span>{sharedVpcZoneId}</span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {!isHypershift && cluster.fips && (
        <DescriptionListGroup>
          <DescriptionListTerm>Encryption level</DescriptionListTerm>
          <DescriptionListDescription>
            <dl className="pf-v5-l-stack">
              <dt data-testid="fipsCryptographyStatus">FIPS Cryptography enabled</dt>
            </dl>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {cluster?.aws?.kms_key_arn ? (
        <>
          <DescriptionListGroup>
            <DescriptionListTerm>Encrypt volumes with custom keys</DescriptionListTerm>
            <DescriptionListDescription>Enabled</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Custom KMS key ARN</DescriptionListTerm>
            <DescriptionListDescription>{cluster.aws.kms_key_arn}</DescriptionListDescription>
          </DescriptionListGroup>
        </>
      ) : null}
      <DescriptionListGroup>
        <DescriptionListTerm>Created at</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp value={get(cluster, 'creation_timestamp', 'N/A')} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Owner</DescriptionListTerm>
        <DescriptionListDescription>
          {get(cluster, 'subscription.creator.name') ||
            get(cluster, 'subscription.creator.username', 'N/A')}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {cluster.managed && !isROSA && (
        <>
          <DescriptionListGroup>
            <DescriptionListTerm>Subscription billing model</DescriptionListTerm>
            <DescriptionListDescription>{getBillingModelLabel(cluster)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Infrastructure billing model</DescriptionListTerm>
            <DescriptionListDescription>
              <InfrastructureModelLabel cluster={cluster} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </>
      )}
    </DescriptionList>
  );
}

DetailsLeft.propTypes = {
  cluster: PropTypes.any,
  cloudProviders: PropTypes.object.isRequired,
  showAssistedId: PropTypes.bool.isRequired,
};

export default DetailsLeft;
