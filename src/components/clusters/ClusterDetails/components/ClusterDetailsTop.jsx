import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  Button, Alert, Split, SplitItem, Title,
} from '@patternfly/react-core';

import clusterStates from '../../common/clusterStates';
import ClusterActionsDropdown from '../../common/ClusterActionsDropdown';
import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../../common/ErrorTriangle';
import getClusterName from '../../../../common/getClusterName';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import ExpirationAlert from './ExpirationAlert';
import Breadcrumbs from '../../common/Breadcrumbs';

function ClusterDetailsTop(props) {
  const {
    cluster,
    openModal,
    pending,
    refreshFunc,
    clusterIdentityProviders,
    organization,
    error,
    errorMessage,
    children,
  } = props;

  const clusterName = getClusterName(cluster);
  const consoleURL = cluster.console ? cluster.console.url : false;

  const hasIdentityProviders = clusterIdentityProviders.clusterIDPList.length > 0;
  const showIDPMessage = (cluster.managed
                          && cluster.state === clusterStates.READY
                          && consoleURL
                          && !hasIdentityProviders);

  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;

  const openIDPModal = () => {
    openModal('create-identity-provider');
  };

  const IdentityProvidersHint = () => (
    <Alert
      id="idpHint"
      variant="warning"
      isInline
      title="Missing Identity Providers"
    >
      Identity Providers determine how users log into the cluster.
      {' '}
      <Button variant="link" isInline onClick={openIDPModal}>Add OAuth Configuration</Button>
      {' '}
      to allow  others to log in.
    </Alert>
  );


  let launchConsole;
  if (consoleURL && (cluster.state !== clusterStates.UNINSTALLING)) {
    launchConsole = (
      <a href={consoleURL} target="_blank" rel="noopener noreferrer" className="pull-left">
        <Button variant="primary">Open Console</Button>
      </a>
    );
  } else if (cluster.managed) {
    launchConsole = (
      <Button variant="primary" isDisabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Admin console is not yet available for this cluster'}>
      Open Console
      </Button>
    );
  } else if (cluster.canEdit) {
    launchConsole = (<Button variant="primary" onClick={() => openModal('edit-console-url', cluster)}>Add Console URL</Button>);
  }

  const actions = (
    <ClusterActionsDropdown
      disabled={!cluster.canEdit && !cluster.canDelete}
      cluster={cluster}
      organization={organization.details}
      showConsoleButton={false}
    />
  );

  const breadcrumbs = (
    <Breadcrumbs path={
        [
          { label: 'Clusters' },
          isArchived && { label: 'Archived Clusters', path: '/archived' },
          { label: clusterName },
        ].filter(Boolean)
      }
    />
  );

  const isRefreshing = pending
      || organization.pending
      || clusterIdentityProviders.pending;


  return (
    <div id="cl-details-top" className="top-row">
      <Split>
        <SplitItem>
          {breadcrumbs}
        </SplitItem>
      </Split>
      <Split id="cl-details-top-row">
        <SplitItem>
          <Title headingLevel="h1" size="4xl" className="vertical-align">{clusterName}</Title>
        </SplitItem>
        <SplitItem>
          { isRefreshing && <Spinner className="cluster-details-spinner" /> }
          { error && <ErrorTriangle errorMessage={errorMessage} className="cluster-details-warning" /> }
        </SplitItem>
        <SplitItem isFilled />
        <SplitItem>
          <span id="cl-details-btns">
            { !isArchived ? (
              <>
                {launchConsole}
                {actions}
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => openModal('unarchive-cluster', {
                  subscriptionID: cluster.subscription ? cluster.subscription.id : '',
                  name: clusterName,
                })}
                isDisabled={!cluster.canEdit}
              >
                Unarchive
              </Button>
            )}
            <RefreshButton id="refresh" autoRefresh refreshFunc={refreshFunc} />
          </span>
        </SplitItem>
      </Split>
      {showIDPMessage && (
      <Split>
        <SplitItem isFilled>
          {!clusterIdentityProviders.pending && cluster.canEdit && <IdentityProvidersHint />}
        </SplitItem>
      </Split>
      )}
      {cluster.expiration_timestamp
      && (
      <ExpirationAlert
        expirationTimestamp={cluster.expiration_timestamp}
      />
      )}
      {children}
    </div>
  );
}

ClusterDetailsTop.propTypes = {
  cluster: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
  children: PropTypes.any,
};

export default ClusterDetailsTop;
