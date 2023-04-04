import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
} from '@patternfly/react-core';
import { OCM } from 'openshift-assisted-ui-lib';

import Timestamp from '../../../../../common/Timestamp';
import links from '../../../../../../common/installLinks.mjs';
import { isAISubscriptionWithoutMetrics } from '../../../../../../common/isAssistedInstallerCluster';
import ClusterNetwork from '../ClusterNetwork';
import { constants } from '../../../../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { humanizeValueWithUnit, humanizeValueWithUnitGiB } from '../../../../../../common/units';
import { extractAWSID } from '../../../../../../common/rosa';
import { subscriptionStatuses } from '../../../../../../common/subscriptionTypes';
import PopoverHint from '../../../../../common/PopoverHint';
import ExternalLink from '../../../../../common/ExternalLink';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { ClusterStatus } from './ClusterStatus';

const { ClusterStatus: AIClusterStatus } = OCM;
function DetailsRight({
  cluster,
  totalDesiredComputeNodes,
  autoscaleEnabled,
  totalMinNodesCount,
  totalMaxNodesCount,
  limitedSupport,
  totalActualNodes,
  machinePools,
}) {
  const isHypershift = isHypershiftCluster(cluster);
  const rosaCreatorArn = get(cluster, 'properties.rosa_creator_arn', '');
  const awsInfraAccount = rosaCreatorArn ? extractAWSID(rosaCreatorArn) : null;

  const memoryTotalWithUnit = humanizeValueWithUnit(
    get(cluster, 'metrics.memory.total.value', 0),
    get(cluster, 'metrics.memory.total.unit', 'B'),
  );

  const isDisconnected =
    get(cluster, 'subscription.status', '') === subscriptionStatuses.DISCONNECTED;

  const billingMarketplaceAccount = get(cluster, 'subscription.billing_marketplace_account', '');

  const showDesiredNodes = cluster.managed;
  const showInfraNodes = isHypershift
    ? false
    : (!cluster.managed && get(cluster, 'metrics.nodes.infra', null)) ||
      get(cluster, 'nodes.infra', 0) > 0;
  const hasSockets = get(cluster, 'metrics.sockets.total.value', 0) > 0;

  const humanizedPersistentStorage =
    cluster.managed &&
    cluster.storage_quota &&
    humanizeValueWithUnitGiB(cluster.storage_quota.value);
  const showVCPU = !isDisconnected && !hasSockets;

  const controlPlaneActualNodes = get(cluster, 'metrics.nodes.master', '-');
  const controlPlaneDesiredNodes = get(cluster, 'nodes.master', '-');

  const infraActualNodes = get(cluster, 'metrics.nodes.infra', '-');
  const infraDesiredNodes = get(cluster, 'nodes.infra', '-');

  const workerActualNodes = totalActualNodes === false ? '-' : totalActualNodes;
  const workerDesiredNodes = totalDesiredComputeNodes || '-';
  const oidcConfig = cluster.aws?.sts?.oidc_config;

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription style={cluster.state.style}>
            {isAISubscriptionWithoutMetrics(cluster.subscription) ? (
              <AIClusterStatus status={cluster.metrics.state} className="clusterstate" />
            ) : (
              <>
                <ClusterStatus
                  cluster={cluster}
                  limitedSupport={limitedSupport}
                  machinePools={machinePools}
                />
                {limitedSupport ? ' - Limited support' : null}
                {cluster?.status?.provision_error_code && (
                  <DescriptionList>
                    {' '}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Details:</DescriptionListTerm>
                      <DescriptionListDescription>
                        {cluster.status.provision_error_code}{' '}
                        {cluster.status?.provision_error_message}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                )}
              </>
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        {showVCPU && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Total vCPU</DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.metrics.cpu.total.value} vCPU
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {!isDisconnected && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Total memory</DescriptionListTerm>
              <DescriptionListDescription>
                {memoryTotalWithUnit.value} {memoryTotalWithUnit.unit}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {awsInfraAccount && (
          <>
            <DescriptionListGroup data-testid="aws-account">
              <DescriptionListTerm>Infrastructure AWS account</DescriptionListTerm>
              <DescriptionListDescription>{awsInfraAccount}</DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {billingMarketplaceAccount && (
          <>
            <DescriptionListGroup data-testid="billing-marketplace-account">
              <DescriptionListTerm>Billing marketplace account</DescriptionListTerm>
              <DescriptionListDescription>{billingMarketplaceAccount}</DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {cluster.managed && !cluster.ccs?.enabled && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Load balancers</DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.load_balancer_quota || 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Persistent storage</DescriptionListTerm>
              <DescriptionListDescription>
                {humanizedPersistentStorage
                  ? `${humanizedPersistentStorage.value}  ${humanizedPersistentStorage.unit}`
                  : 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {/* Nodes */}
        {showDesiredNodes && !autoscaleEnabled ? (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Nodes
                <span className="font-weight-normal"> (actual/desired)</span>
                <PopoverHint
                  id="cluster-scaling-hint"
                  iconClassName="nodes-hint"
                  hint="The actual number of compute nodes may not always match with the number of desired when the cluster is scaling."
                />
              </DescriptionListTerm>
              <DescriptionListDescription>
                <dl className="pf-l-stack">
                  {!isHypershift && (
                    <Flex>
                      <dt>Control plane: </dt>
                      <dd>
                        {controlPlaneActualNodes !== '-' || controlPlaneDesiredNodes !== '-'
                          ? `${controlPlaneActualNodes}/${controlPlaneDesiredNodes}`
                          : 'N/A'}
                      </dd>
                    </Flex>
                  )}
                  {showInfraNodes && (
                    <>
                      <Flex>
                        <dt>Infra: </dt>
                        <dd>
                          {infraActualNodes !== '-' || infraDesiredNodes !== '-'
                            ? `${infraActualNodes}/${infraDesiredNodes}`
                            : 'N/A'}
                        </dd>
                      </Flex>
                    </>
                  )}
                  <Flex>
                    <dt>Compute: </dt>
                    <dd>
                      {workerActualNodes !== '-' || workerDesiredNodes !== '-'
                        ? `${workerActualNodes}/${workerDesiredNodes}`
                        : 'N/A'}
                    </dd>
                  </Flex>
                </dl>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        ) : (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Nodes</DescriptionListTerm>
              <DescriptionListDescription>
                <dl className="pf-l-stack">
                  {!isHypershift && (
                    <Flex>
                      <dt>Control plane: </dt>
                      <dd>{get(cluster, 'metrics.nodes.master', 'N/A')}</dd>
                    </Flex>
                  )}
                  {showInfraNodes && (
                    <>
                      <Flex>
                        <dt>Infra: </dt>
                        <dd>{get(cluster, 'metrics.nodes.infra', 'N/A')}</dd>
                      </Flex>
                    </>
                  )}
                  <Flex>
                    <dt>Compute: </dt>
                    <dd>{totalActualNodes || 'N/A'}</dd>
                  </Flex>
                </dl>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {cluster.aiCluster && (
          <>
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
          </>
        )}
        {/* Autoscaling */}
        {autoscaleEnabled && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Autoscale
                <PopoverHint
                  id="autoscaling-hint"
                  iconClassName="nodes-hint"
                  hint={
                    <>
                      {constants.autoscaleHint}{' '}
                      <ExternalLink href={links.APPLYING_AUTOSCALING}>
                        Learn more about autoscaling
                      </ExternalLink>
                    </>
                  }
                />
              </DescriptionListTerm>
              <DescriptionListDescription>Enabled</DescriptionListDescription>
              <DescriptionListDescription>
                <span className="autoscale-data-t">Min:</span> {totalMinNodesCount}
                <span className="pf-u-ml-lg autoscale-data-t">Max: </span>
                {totalMaxNodesCount}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {/* Network */}
        <ClusterNetwork cluster={cluster} />

        {oidcConfig && (
          <DescriptionListGroup>
            <DescriptionListTerm>OIDC Configuration</DescriptionListTerm>
            <DescriptionListDescription>
              <dl className="pf-l-stack">
                <Flex>
                  <dt>Type:</dt>
                  <dd>{oidcConfig?.managed ? 'Red Hat managed' : 'Self-managed'}</dd>
                </Flex>
                <Flex>
                  <dt>ID:</dt>
                  <dd>{oidcConfig?.id}</dd>
                </Flex>
              </dl>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </>
  );
}

DetailsRight.propTypes = {
  cluster: PropTypes.any,
  totalDesiredComputeNodes: PropTypes.number,
  totalMinNodesCount: PropTypes.number,
  totalMaxNodesCount: PropTypes.number,
  autoscaleEnabled: PropTypes.bool.isRequired,
  limitedSupport: PropTypes.bool,
  totalActualNodes: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  machinePools: PropTypes.array,
};

export default DetailsRight;
