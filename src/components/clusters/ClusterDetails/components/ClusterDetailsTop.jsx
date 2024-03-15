import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Button, Alert, Split, SplitItem, Title, Flex } from '@patternfly/react-core';

import { PreviewLabel } from '~/components/clusters/common/PreviewLabel';
import { GCP_SECURE_BOOT_ENHANCEMENTS } from '~/redux/constants/featureConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import clusterStates, { isOffline } from '../../common/clusterStates';
import modals from '../../../common/Modal/modals';
import ClusterActionsDropdown from '../../common/ClusterActionsDropdown';
import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../../common/ErrorTriangle';
import getClusterName from '../../../../common/getClusterName';
import {
  subscriptionStatuses,
  normalizedProducts,
  billingModels,
} from '../../../../common/subscriptionTypes';
import {
  isAvailableAssistedInstallCluster,
  isUninstalledAICluster,
} from '../../../../common/isAssistedInstallerCluster';
import ExpirationAlert from './ExpirationAlert';
import LimitedSupportAlert from './LimitedSupportAlert';
import Breadcrumbs from '../../../common/Breadcrumbs';
import SubscriptionCompliancy from './SubscriptionCompliancy';
import ClusterNonEditableAlert from './ClusterNonEditableAlert';
import TransferClusterOwnershipInfo from './TransferClusterOwnershipInfo';
import TermsAlert from './TermsAlert';
import ButtonWithTooltip from '../../../common/ButtonWithTooltip';
import { goZeroTime2Null } from '../../../../common/helpers';
import GcpOrgPolicyAlert from './GcpOrgPolicyAlert';

const IdentityProvidersHint = () => (
  <Alert
    id="idpHint"
    className="pf-v5-u-mt-md"
    variant="warning"
    isInline
    title="Missing identity providers"
  >
    Identity providers determine how users log into the cluster.{' '}
    <Button
      variant="link"
      isInline
      onClick={() => {
        window.location.hash = 'accessControl';
      }}
    >
      Add OAuth configuration
    </Button>{' '}
    to allow others to log in.
  </Alert>
);

function ClusterDetailsTop(props) {
  const {
    cluster,
    openModal,
    pending,
    refreshFunc,
    clickRefreshFunc,
    clusterIdentityProviders,
    organization,
    error,
    errorMessage,
    children,
    canSubscribeOCP,
    canTransferClusterOwnership,
    canHibernateCluster,
    autoRefreshEnabled,
    toggleSubscriptionReleased,
    showPreviewLabel,
    logs,
  } = props;

  const isProductOSDTrial =
    get(cluster, 'subscription.plan.type', '') === normalizedProducts.OSDTrial;
  const isProductOSDRHM =
    get(cluster, 'subscription.plan.type', '') === normalizedProducts.OSD &&
    get(cluster, 'subscription.cluster_billing_model', '') === billingModels.MARKETPLACE;
  const isOSD = get(cluster, 'subscription.plan.type') === normalizedProducts.OSD;
  const isROSA = get(cluster, 'subscription.plan.type') === normalizedProducts.ROSA;
  const clusterName = getClusterName(cluster);
  const consoleURL = cluster.console ? cluster.console.url : false;
  const creationDateStr = get(cluster, 'creation_timestamp', '');

  const hasIdentityProviders = clusterIdentityProviders.clusterIDPList.length > 0;
  const showIDPMessage =
    cluster.managed &&
    cluster.idpActions?.create &&
    cluster.state === clusterStates.READY &&
    clusterIdentityProviders.fulfilled &&
    !hasIdentityProviders;

  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;

  const isDeprovisioned =
    get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
  const canUpgradeTrial = cluster.state === clusterStates.READY && cluster.canEdit;
  const trialExpirationUpgradeProps = canUpgradeTrial
    ? {
        trialExpiration: true,
        openModal,
        cluster,
      }
    : {};

  let launchConsole;
  if (consoleURL && !isOffline(cluster)) {
    launchConsole = (
      <a
        href={consoleURL}
        target="_blank"
        rel="noopener noreferrer"
        className="pull-left"
        data-testid="console-url-link"
      >
        <Button variant="primary">Open console</Button>
      </a>
    );
  } else if (cluster.managed) {
    launchConsole = (
      <Button
        variant="primary"
        isDisabled
        title={
          cluster.state === clusterStates.UNINSTALLING
            ? 'The cluster is being uninstalled'
            : 'Admin console is not yet available for this cluster'
        }
      >
        Open console
      </Button>
    );
  } else if (cluster.canEdit && !isUninstalledAICluster(cluster)) {
    launchConsole = (
      <Button variant="primary" onClick={() => openModal(modals.EDIT_CONSOLE_URL, cluster)}>
        Add console URL
      </Button>
    );
  }

  const actions = !isUninstalledAICluster(cluster) && (
    <ClusterActionsDropdown
      disabled={!cluster.canEdit && !cluster.canDelete}
      cluster={cluster}
      organization={organization.details}
      showConsoleButton={false}
      canSubscribeOCP={canSubscribeOCP}
      canTransferClusterOwnership={canTransferClusterOwnership}
      toggleSubscriptionReleased={toggleSubscriptionReleased}
      canHibernateCluster={canHibernateCluster}
      refreshFunc={refreshFunc}
    />
  );

  const breadcrumbs = (
    <Breadcrumbs
      path={[
        { label: 'Clusters' },
        (isArchived || isDeprovisioned) && { label: 'Cluster Archives', path: '/archived' },
        { label: clusterName },
      ].filter(Boolean)}
    />
  );

  const isRefreshing = pending || organization.pending || clusterIdentityProviders.pending;

  const trialEndDate = isProductOSDTrial && get(cluster, 'subscription.trial_end_date');
  const OSDRHMEndDate =
    isProductOSDRHM && goZeroTime2Null(get(cluster, 'subscription.billing_expiration_date'));

  const canNotEditReason =
    !cluster.canEdit && 'You do not have permissions to unarchive this cluster';

  const unarchiveBtn = (
    <ButtonWithTooltip
      variant="secondary"
      onClick={() =>
        openModal(modals.UNARCHIVE_CLUSTER, {
          subscriptionID: cluster.subscription ? cluster.subscription.id : '',
          name: clusterName,
        })
      }
      disableReason={canNotEditReason}
    >
      Unarchive
    </ButtonWithTooltip>
  );

  const orgPolicyWarning = logs?.find(
    (obj) =>
      obj.summary?.includes('Please enable the Org Policy API for the GCP project') ||
      obj.summary?.includes('GCP Organization Policy Service'),
  );

  const isSecureBootEnhancementsEnabled = useFeatureGate(GCP_SECURE_BOOT_ENHANCEMENTS);
  const showGcpOrgPolicyWarning =
    isSecureBootEnhancementsEnabled &&
    orgPolicyWarning &&
    !isDeprovisioned &&
    cluster.state !== clusterStates.READY &&
    cluster.state !== clusterStates.UNINSTALLING;

  return (
    <div id="cl-details-top" className="top-row">
      <Split>
        <SplitItem className="pf-v5-u-pb-md">{breadcrumbs}</SplitItem>
      </Split>
      <Split id="cl-details-top-row">
        <SplitItem>
          <Title size="2xl" headingLevel="h1" className="cl-details-page-title">
            {clusterName}
            {showPreviewLabel && (
              <PreviewLabel creationDateStr={creationDateStr} className="pf-v5-u-ml-sm" />
            )}
          </Title>
        </SplitItem>
        <SplitItem>
          {isRefreshing && <Spinner className="cluster-details-spinner" />}
          {error && (
            <ErrorTriangle errorMessage={errorMessage} className="cluster-details-warning" />
          )}
        </SplitItem>
        <SplitItem isFilled />
        <SplitItem>
          <Flex
            flexWrap={{ default: 'nowrap' }}
            alignItems={{ default: 'alignItemsCenter' }}
            spaceItems={{ default: 'spaceItemsSm' }}
            id="cl-details-btns"
          >
            {!isArchived && !isDeprovisioned ? (
              <>
                {launchConsole}
                {actions}
              </>
            ) : (
              !isDeprovisioned && unarchiveBtn
            )}
            {!isDeprovisioned && !isArchived && (
              <RefreshButton
                id="refresh"
                autoRefresh={autoRefreshEnabled}
                refreshFunc={refreshFunc}
                clickRefreshFunc={clickRefreshFunc}
                useShortTimer={!Object.values(clusterStates).includes(cluster.state)}
              />
            )}
          </Flex>
        </SplitItem>
      </Split>

      <LimitedSupportAlert
        limitedSupportReasons={cluster.limitedSupportReasons}
        isOSD={isOSD}
        isROSA={isROSA}
      />

      {showIDPMessage && (
        <Split>
          <SplitItem isFilled>
            <IdentityProvidersHint />
          </SplitItem>
        </Split>
      )}
      {cluster.expiration_timestamp && (
        <ExpirationAlert expirationTimestamp={cluster.expiration_timestamp} />
      )}
      {trialEndDate && !isDeprovisioned && (
        <ExpirationAlert expirationTimestamp={trialEndDate} {...trialExpirationUpgradeProps} />
      )}
      {OSDRHMEndDate && !isDeprovisioned && (
        <ExpirationAlert expirationTimestamp={OSDRHMEndDate} OSDRHMExpiration />
      )}
      {showGcpOrgPolicyWarning && <GcpOrgPolicyAlert summary={orgPolicyWarning?.summary} />}

      <SubscriptionCompliancy
        cluster={cluster}
        openModal={openModal}
        canSubscribeOCP={canSubscribeOCP}
      />
      {!cluster.canEdit && isAvailableAssistedInstallCluster(cluster) && (
        <ClusterNonEditableAlert />
      )}
      <TransferClusterOwnershipInfo subscription={cluster.subscription} />
      <TermsAlert subscription={cluster.subscription} />
      {children}
    </div>
  );
}

ClusterDetailsTop.propTypes = {
  cluster: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  clickRefreshFunc: PropTypes.func,
  pending: PropTypes.bool.isRequired,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  children: PropTypes.any,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canHibernateCluster: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  autoRefreshEnabled: PropTypes.bool,
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  showPreviewLabel: PropTypes.bool.isRequired,
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

export default ClusterDetailsTop;
