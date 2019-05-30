import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/result';

import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Row, Col, Grid, DropdownButton, ButtonGroup, Breadcrumb, Spinner, HintBlock,
} from 'patternfly-react';

import clusterStates from '../../common/clusterStates';
import ClusterActionsDropdown from '../../common/ClusterActionsDropdown';
import ClusterCredentialsModal from './ClusterCredentialsModal';
import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import ClusterBadge from '../../common/ClusterBadge/ClusterBadge';

class ClusterDetailsTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showIDPHint: true };
  }

  hideIDPHint = () => {
    this.setState({ showIDPHint: false });
  }

  render() {
    const {
      cluster,
      credentials,
      openModal,
      pending,
      routerShards,
      refreshFunc,
      clusterIdentityProviders,
      organization,
    } = this.props;

    const clusterName = cluster.display_name || cluster.name || cluster.external_id || 'Unnamed Cluster';

    const { showIDPHint } = this.state;

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
              <Button className="buttonHref" onClick={openIDPModal}>Add OAuth Configuration</Button>
              {' '}
            to allow  others to log in.
            </p>
          </React.Fragment>
        )}
        onClose={() => this.hideIDPHint()}
      />
    );

    const consoleURL = cluster.console ? cluster.console.url : false;

    const launchConsole = consoleURL && (cluster.state !== clusterStates.UNINSTALLING) ? (
      <a href={consoleURL} target="_blank" rel="noreferrer" className="pull-left">
        <Button bsStyle="primary">Launch Console</Button>
      </a>)
      : (
        <Button bsStyle="primary" disabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Admin console is not yet available for this cluster'}>
        Launch Console
        </Button>
      );

    const actions = (
      <DropdownButton
        id="actions"
        bsStyle="default"
        title="Actions"
        pullRight
        disabled={!cluster.canEdit && !cluster.canDelete}
      >
        <ClusterActionsDropdown
          cluster={cluster}
          organization={organization.details}
          showConsoleButton={false}
          showIDPButton
          hasIDP={hasIdentityProviders}
          idpID={get(clusterIdentityProviders, 'clusterIDPList[0].id', '')}
        />
      </DropdownButton>
    );

    const hasCredentials = (cluster.state === 'ready'
                                && get(credentials, 'credentials.admin.password', false)
                                && get(credentials, 'credentials.id') === cluster.id);

    const credentialsButton = hasCredentials
      ? (
        <React.Fragment>
          <Button bsStyle="default" onClick={() => { openModal('cluster-credentials'); }}>Admin Credentials</Button>
          <ClusterCredentialsModal credentials={credentials.credentials} />
        </React.Fragment>
      )
      : <Button bsStyle="default" disabled>Admin Credentials</Button>;

    const isRefreshing = pending
      || credentials.pending
      || routerShards.pending
      || organization.pending;

    return (
      <Grid fluid>
        <Row>
          <Col sm={8}>
            <Breadcrumb>
              <LinkContainer to="/clusters">
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
        <hr />
        <Row>
          <Col sm={6} className="cl-details-cluster-name">
            <h1>
              <ClusterBadge clusterName={clusterName} />
            </h1>
            { isRefreshing ? <Spinner loading /> : false }
          </Col>
          <Col lg={5} lgOffset={1}>
            <ButtonGroup id="cl-details-btns">
              {launchConsole}
              {credentialsButton}
              {actions}
              <RefreshButton id="refresh" autoRefresh refreshFunc={refreshFunc} />
            </ButtonGroup>
          </Col>
        </Row>
        {cluster.managed && !hasIdentityProviders && showIDPHint && (
        <Row>
          <Col sm={12}>
            {clusterIdentityProviders.pending ? <Spinner loading /> : <IdentityProvidersHint />}
          </Col>
        </Row>)}
      </Grid>
    );
  }
}

ClusterDetailsTop.propTypes = {
  cluster: PropTypes.object,
  credentials: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  routerShards: PropTypes.object.isRequired,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default ClusterDetailsTop;
