import React, { useState } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { Alert, Button, Flex, Split, SplitItem, Title } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import getClusterName from '~/common/getClusterName';
import { goZeroTime2Null } from '~/common/helpers';
import isAssistedInstallSubscription, {
  isAvailableAssistedInstallCluster,
  isUninstalledAICluster,
} from '~/common/isAssistedInstallerCluster';
import { HAS_USER_DISMISSED_RECOMMENDED_OPERATORS_ALERT } from '~/common/localStorageConstants';
import { useNavigate } from '~/common/routing';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { PreviewLabel } from '~/components/clusters/common/PreviewLabel';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ButtonWithTooltip from '~/components/common/ButtonWithTooltip';
import modals from '~/components/common/Modal/modals';
import RefreshButton from '~/components/common/RefreshButton/RefreshButton';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import ClusterActionsDropdown from '../../../common/archived_do_not_use/ClusterActionsDropdown';
import clusterStates, {
  hasInflightEgressErrors,
  isHibernating,
  isOffline,
} from '../../../common/clusterStates';
import ErrorTriangle from '../../../common/ErrorTriangle';
import HibernatingClusterCard from '../../../common/HibernatingClusterCard/HibernatingClusterCard';
import { isExtenalAuthenicationActive } from '../../clusterDetailsHelper';
import { shouldShowLogs } from '../Overview/InstallationLogView';

import ClusterNonEditableAlert from './components/ClusterNonEditableAlert';
import ClusterProgressCard from './components/ClusterProgressCard';
import ClusterStatusMonitor from './components/ClusterStatusMonitor';
import ExpirationAlert from './components/ExpirationAlert';
import GcpOrgPolicyAlert from './components/GcpOrgPolicyAlert';
import LimitedSupportAlert from './components/LimitedSupportAlert';
import { RecommendedOperatorsAlert } from './components/RecommendedOperatorsAlert/RecommendedOperatorsAlert';
import SubscriptionCompliancy from './components/SubscriptionCompliancy';
import TermsAlert from './components/TermsAlert';
import TransferClusterOwnershipInfo from './components/TransferClusterOwnershipInfo';

const IdentityProvidersHint = () => {
  const navigate = useNavigate();
  return (
    <Alert
      id="idpHint"
      className="pf-v5-u-mt-md"
      isInline
      title="Create an identity provider to access cluster"
    >
      Identity providers determine how you can log into the cluster. You&apos;ll need to set this up
      so you can access your cluster{' '}
      <p>
        <Button
          variant="link"
          isInline
          onClick={() =>
            navigate({
              hash: '#accessControl',
            })
          }
        >
          Create identity provider
        </Button>{' '}
      </p>
    </Alert>
  );
};

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
    openDrawer,
    closeDrawer,
    selectedCardTitle,
  } = props;

  const hasAlertBeenDismissed = localStorage.getItem(
    HAS_USER_DISMISSED_RECOMMENDED_OPERATORS_ALERT,
  );
  const isArchived =
    get(cluster, 'subscription.status', false) === SubscriptionCommonFields.status.ARCHIVED;
  const isDeprovisioned =
    get(cluster, 'subscription.status', false) === SubscriptionCommonFields.status.DEPROVISIONED;

  const [showRecommendedOperatorsAlert, setShowRecommendedOperatorsAlert] = useState(
    !hasAlertBeenDismissed && !isArchived && !isDeprovisioned,
  );

  let topCard = null;

  if (isHibernating(cluster)) {
    topCard = <HibernatingClusterCard cluster={cluster} openModal={openModal} />;
  } else if (
    cluster &&
    !isAssistedInstallSubscription(cluster.subscription) &&
    (shouldShowLogs(cluster) || hasInflightEgressErrors(cluster))
  ) {
    topCard = <ClusterProgressCard cluster={cluster} />;
  }

  const isProductOSDTrial =
    get(cluster, 'subscription.plan.type', '') === normalizedProducts.OSDTRIAL;
  const isProductOSDRHM =
    get(cluster, 'subscription.plan.type', '') === normalizedProducts.OSD &&
    get(cluster, 'subscription.cluster_billing_model', '') ===
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE;
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
    !hasIdentityProviders &&
    !isExtenalAuthenicationActive(cluster);

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
        { label: 'Cluster List' },
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
      onClick={() => {
        openModal(modals.UNARCHIVE_CLUSTER, {
          subscriptionID: cluster.subscription ? cluster.subscription.id : '',
          name: clusterName,
        });
      }}
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

  const showGcpOrgPolicyWarning =
    orgPolicyWarning &&
    !isDeprovisioned &&
    cluster.state !== clusterStates.READY &&
    cluster.state !== clusterStates.UNINSTALLING;

  const shouldShowStatusMonitor =
    [
      clusterStates.WAITING,
      clusterStates.PENDING,
      clusterStates.INSTALLING,
      clusterStates.ERROR,
      clusterStates.UNINSTALLING,
    ].includes(cluster.state) || hasInflightEgressErrors(cluster);

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

      {topCard}

      <LimitedSupportAlert
        limitedSupportReasons={cluster.limitedSupportReasons}
        isOSD={isOSD}
        isROSA={isROSA}
      />

      {shouldShowStatusMonitor ? (
        <ClusterStatusMonitor refresh={refreshFunc} cluster={cluster} />
      ) : null}

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
      {showRecommendedOperatorsAlert ? (
        <RecommendedOperatorsAlert
          openLearnMore={openDrawer}
          selectedCardTitle={selectedCardTitle}
          closeDrawer={closeDrawer}
          onDismissAlertCallback={() => setShowRecommendedOperatorsAlert(false)}
          clusterState={cluster.state}
          consoleURL={consoleURL}
        />
      ) : null}
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
  openDrawer: PropTypes.func,
  closeDrawer: PropTypes.func,
  selectedCardTitle: PropTypes.string,
};

export default ClusterDetailsTop;
