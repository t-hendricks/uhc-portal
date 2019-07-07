import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/result';

import { LinkContainer } from 'react-router-bootstrap';
import {
  Row, Col, Grid, Breadcrumb, Spinner, HintBlock,
} from 'patternfly-react';
import { Button } from '@patternfly/react-core';

import clusterStates from '../../common/clusterStates';
import ClusterActionsDropdown from '../../common/ClusterActionsDropdown';
import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../../common/ErrorTriangle';

function ClusterDetailsTop(props) {
  const {
    cluster,
    openModal,
    pending,
    routerShards,
    refreshFunc,
    clusterIdentityProviders,
    organization,
    error,
    errorMessage,
    children,
  } = props;

  const clusterName = cluster.display_name || cluster.name || cluster.external_id || 'Unnamed Cluster';

  const hasIdentityProviders = clusterIdentityProviders.clusterIDPList.length > 0;

  const openIDPModal = () => {
    openModal('create-identity-provider', { clusterName });
  };

  const IdentityProvidersHint = () => (
    <HintBlock
      id="idpHint"
      title="Missing Identity Providers"
      body={(
        <React.Fragment>
          <p>
            Identity Providers determine how users log into the cluster.
            {' '}
            <Button variant="link" isInline onClick={openIDPModal}>Add OAuth Configuration</Button>
            {' '}
            to allow  others to log in.
          </p>
        </React.Fragment>
        )}
    />
  );

  const consoleURL = cluster.console ? cluster.console.url : false;

  const launchConsole = consoleURL && (cluster.state !== clusterStates.UNINSTALLING) ? (
    <a href={consoleURL} target="_blank" rel="noreferrer" className="pull-left">
      <Button variant="primary">Launch Console</Button>
    </a>)
    : (
      <Button variant="primary" isDisabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Admin console is not yet available for this cluster'}>
        Launch Console
      </Button>
    );

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
      || routerShards.pending
      || organization.pending;

  return (
    <div id="cl-details-top">
      <Grid fluid>
        <Row>
          <Col sm={8}>
            <Breadcrumb>
              <LinkContainer to="">
                <Breadcrumb.Item href="#">
                    Clusters
                </Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>
                {clusterName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col sm={6} className="cl-details-cluster-name">
            <h1>{clusterName}</h1>
            { isRefreshing ? <Spinner loading /> : false }
            { error && <ErrorTriangle errorMessage={errorMessage} />}
          </Col>
          <Col lg={5} lgOffset={1}>
            <span id="cl-details-btns">
              {launchConsole}
              {actions}
              <RefreshButton id="refresh" autoRefresh refreshFunc={refreshFunc} />
            </span>
          </Col>
        </Row>
        {cluster.managed && !hasIdentityProviders && (
        <Row>
          <Col sm={12}>
            {clusterIdentityProviders.pending ? <Spinner loading /> : <IdentityProvidersHint />}
          </Col>
        </Row>)}
      </Grid>
      {children}
    </div>
  );
}

ClusterDetailsTop.propTypes = {
  cluster: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  routerShards: PropTypes.object.isRequired,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  children: PropTypes.any,
};

export default ClusterDetailsTop;
