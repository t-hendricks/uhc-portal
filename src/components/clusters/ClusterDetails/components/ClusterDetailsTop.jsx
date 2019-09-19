import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/result';

import { LinkContainer } from 'react-router-bootstrap';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  Breadcrumb, BreadcrumbItem, Button, Alert, Split, SplitItem, Title,
} from '@patternfly/react-core';

import clusterStates from '../../common/clusterStates';
import ClusterActionsDropdown from '../../common/ClusterActionsDropdown';
import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../../common/ErrorTriangle';

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

  const clusterName = get(cluster, 'subscription.display_name', false) || cluster.display_name || cluster.name || cluster.external_id || 'Unnamed Cluster';

  const hasIdentityProviders = clusterIdentityProviders.clusterIDPList.length > 0;

  const openIDPModal = () => {
    openModal('create-identity-provider', { clusterName });
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

  const consoleURL = cluster.console ? cluster.console.url : false;

  let launchConsole;
  if (consoleURL && (cluster.state !== clusterStates.UNINSTALLING)) {
    launchConsole = (
      <a href={consoleURL} target="_blank" rel="noreferrer" className="pull-left">
        <Button variant="primary">Launch Console</Button>
      </a>
    );
  } else if (cluster.managed) {
    launchConsole = (
      <Button variant="primary" isDisabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Admin console is not yet available for this cluster'}>
      Launch Console
      </Button>
    );
  } else if (cluster.canEdit) {
    launchConsole = (<Button variant="primary" onClick={() => openModal('edit-console-url')}>Add Console URL</Button>);
  }

  const actions = (
    <ClusterActionsDropdown
      disabled={!cluster.canEdit && !cluster.canDelete}
      cluster={cluster}
      organization={organization.details}
      showConsoleButton={false}
      showIDPButton
      hasIDP={hasIdentityProviders}
      idpID={get(clusterIdentityProviders, 'clusterIDPList[0].id', '')}
    />
  );

  const isRefreshing = pending
      || organization.pending
      || clusterIdentityProviders.pending;

  return (
    <div id="cl-details-top" className="top-row">
      <Split>
        <SplitItem>
          <Breadcrumb>
            <LinkContainer to="">
              <BreadcrumbItem to="#">
                Clusters
              </BreadcrumbItem>
            </LinkContainer>
            <BreadcrumbItem isActive>
              {clusterName}
            </BreadcrumbItem>
          </Breadcrumb>
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
            {launchConsole}
            {actions}
            <RefreshButton id="refresh" autoRefresh refreshFunc={refreshFunc} />
          </span>
        </SplitItem>
      </Split>
      {cluster.managed && !hasIdentityProviders && (
      <Split>
        <SplitItem isFilled>
          {!clusterIdentityProviders.pending && <IdentityProvidersHint />}
        </SplitItem>
      </Split>)
      }
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
  errorMessage: PropTypes.string,
  children: PropTypes.any,
};

export default ClusterDetailsTop;
