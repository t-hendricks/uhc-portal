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
import * as OCM from '@openshift-assisted/ui-lib/ocm';
import { isROSA } from '~/components/clusters/common/clusterStates';
import { IMDSType } from '~/components/clusters/wizards/common';
import { isRestrictedEnv } from '~/restrictedEnv';

import Timestamp from '../../../../../common/Timestamp';
import links from '../../../../../../common/installLinks.mjs';
import { isAISubscriptionWithoutMetrics } from '../../../../../../common/isAssistedInstallerCluster';
import ClusterNetwork from '../ClusterNetwork';
import { constants } from '../../../../CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { humanizeValueWithUnit, humanizeValueWithUnitGiB } from '../../../../../../common/units';
import { subscriptionStatuses } from '../../../../../../common/subscriptionTypes';
import PopoverHint from '../../../../../common/PopoverHint';
import ExternalLink from '../../../../../common/ExternalLink';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { ClusterStatus } from './ClusterStatus';

const { ClusterStatus: AIClusterStatus } = OCM;
function DetailsRight({
  cluster,
  totalDesiredComputeNodes,
  canAutoscaleCluster,
  hasAutoscaleMachinePools,
  hasAutoscaleCluster,
  totalMinNodesCount,
  totalMaxNodesCount,
  limitedSupport,
  totalActualNodes,
  machinePools,
}) {
  const isAWS = cluster.subscription?.cloud_provider_id === 'aws';
  const isHypershift = isHypershiftCluster(cluster);
  const isROSACluster = isROSA(cluster);
  const infraAccount = cluster.subscription?.cloud_account_id || null;
  const hypershiftEtcdEncryptionKey = isHypershift && cluster.aws?.etcd_encryption?.kms_key_arn;

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
  const showVCPU = !isDisconnected && !hasSockets && !isRestrictedEnv();
  const showMemory = !isDisconnected && !isRestrictedEnv();

  const controlPlaneActualNodes = get(cluster, 'metrics.nodes.master', '-');
  const controlPlaneDesiredNodes = get(cluster, 'nodes.master', '-');

  const infraActualNodes = get(cluster, 'metrics.nodes.infra', '-');
  const infraDesiredNodes = get(cluster, 'nodes.infra', '-');
  const cloudProviderId = get(cluster, 'cloud_provider.id', '-');

  const workerActualNodes = totalActualNodes === false ? '-' : totalActualNodes;
  const workerDesiredNodes = totalDesiredComputeNodes || '-';
  const oidcConfig = cluster.aws?.sts?.oidc_config;
  const imdsConfig = cluster.aws?.ec2_metadata_http_tokens || IMDSType.V1AndV2;

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription style={cluster.state.style}>
            {isAISubscriptionWithoutMetrics(cluster.subscription) ? (
              <div data-testid="aiSubscriptionWithoutMetric">
                <AIClusterStatus status={cluster.metrics.state} className="clusterstate" />
              </div>
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
        {showMemory && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Total memory</DescriptionListTerm>
              <DescriptionListDescription>
                {memoryTotalWithUnit.value} {memoryTotalWithUnit.unit}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {infraAccount && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>{`Infrastructure ${cloudProviderId.toUpperCase()} account`}</DescriptionListTerm>
              <DescriptionListDescription>
                <span data-testid={`infrastructure${cloudProviderId.toUpperCase()}Account`}>
                  {infraAccount}
                </span>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {hypershiftEtcdEncryptionKey && (
          <>
            <DescriptionListGroup data-testid="hs-etcd-encryption">
              <DescriptionListTerm>KMS etcd encryption key ARN</DescriptionListTerm>
              <DescriptionListDescription>{hypershiftEtcdEncryptionKey}</DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {isROSACluster && !isHypershift && (
          <>
            <DescriptionListGroup data-testid="etcd-encryption-key">
              <DescriptionListTerm>Additional encryption </DescriptionListTerm>
              <DescriptionListDescription>
                <span data-testid="etcEncryptionStatus">
                  {cluster.etcd_encryption ? 'Enabled' : 'Disabled'}
                </span>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {billingMarketplaceAccount && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Billing marketplace account</DescriptionListTerm>
              <DescriptionListDescription>
                <span data-testid="billingMarketplaceAccount">{billingMarketplaceAccount}</span>
              </DescriptionListDescription>
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
        {!isRestrictedEnv() && (
          <>
            {showDesiredNodes && !hasAutoscaleMachinePools ? (
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
                        <Flex data-testid="controlPlaneNodesCountContainer">
                          <dt>Control plane: </dt>
                          <dd data-testid="controlPlaneNodesCount">
                            {controlPlaneActualNodes !== '-' || controlPlaneDesiredNodes !== '-'
                              ? `${controlPlaneActualNodes}/${controlPlaneDesiredNodes}`
                              : 'N/A'}
                          </dd>
                        </Flex>
                      )}
                      {showInfraNodes && (
                        <>
                          <Flex data-testid="InfraNodesCountContainer">
                            <dt>Infra: </dt>
                            <dd data-testid="infraNodesCount">
                              {infraActualNodes !== '-' || infraDesiredNodes !== '-'
                                ? `${infraActualNodes}/${infraDesiredNodes}`
                                : 'N/A'}
                            </dd>
                          </Flex>
                        </>
                      )}
                      <Flex>
                        <dt>Compute: </dt>
                        <dd data-testid="computeNodeCount">
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
                        <Flex data-testid="controlPlaneNodesCountContainer">
                          <dt>Control plane: </dt>
                          <dd>{get(cluster, 'metrics.nodes.master', 'N/A')}</dd>
                        </Flex>
                      )}
                      {showInfraNodes && (
                        <>
                          <Flex data-testid="InfraNodesCountContainer">
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
        {/* Cluster Autoscaling */}
        {canAutoscaleCluster && (
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster autoscaling</DescriptionListTerm>
            <DescriptionListDescription>
              <span data-testid="clusterAutoscalingStatus">
                {hasAutoscaleCluster ? 'Enabled' : 'Disabled'}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {/* MachinePools Autoscaling */}
        {hasAutoscaleMachinePools && (
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
        {/* IMDS */}
        {isAWS && !isHypershift && (
          <DescriptionListGroup>
            <DescriptionListTerm>Instance Metadata Service (IMDS)</DescriptionListTerm>
            <DescriptionListDescription>
              <span data-testid="instanceMetadataService">
                {imdsConfig === IMDSType.V1AndV2 ? 'IMDSv1 and IMDSv2' : 'IMDSv2 only'}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {/* Network */}
        <ClusterNetwork cluster={cluster} />
        {/* OIDC config */}
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
  hasAutoscaleMachinePools: PropTypes.bool.isRequired,
  hasAutoscaleCluster: PropTypes.bool.isRequired,
  canAutoscaleCluster: PropTypes.bool.isRequired,
  limitedSupport: PropTypes.bool,
  totalActualNodes: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  machinePools: PropTypes.array,
};

export default DetailsRight;
