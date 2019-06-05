// ClusterListEmptyState is the empty state (no clusters) for ClusterList
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, EmptyState, Card, CardGrid, CardTitle, CardBody,
} from 'patternfly-react';

function ClusterListEmptyState(props) {
  const { showCreationForm, hasQuota } = props;

  const createManaged = (
    <EmptyState.Action>
      <Button bsStyle="primary" bsSize="large" onClick={showCreationForm}>
        Create Red Hat-Managed Cluster
      </Button>
    </EmptyState.Action>
  );

  const createSelfManaged = (
    <EmptyState.Action>
      <Button bsStyle="primary" bsSize="large" href={APP_EMBEDDED ? '/openshift/install' : '/install'} target="_blank">
        Create Self-Installed Cluster
      </Button>
    </EmptyState.Action>
  );

  return (
    <EmptyState className="full-page-blank-slate">
      <Row>
        <EmptyState.Title>
          No Clusters Exist
        </EmptyState.Title>
        <EmptyState.Info>
          There are no clusters to display. Create a cluster to get started.
        </EmptyState.Info>
      </Row>
      <CardGrid matchHeight>
        <Row className="cluster-list-emptystate-options">
          {hasQuota && (
            <React.Fragment>
              <Col md={4} mdOffset={2}>
                <Card className="cluster-list-emptystate-preferred" accented matchHeight>
                  <CardBody>
                    <p className="cluster-list-emptystate-preferred-string">Preferred method</p>
                    <CardTitle>Red Hat-Managed Cluster</CardTitle>
                    <p>
                  Create a Red Hat-managed cluster (OSD),
                  to provision the cluster on Amazon Web Services.
                    </p>
                    {createManaged}
                  </CardBody>
                </Card>
              </Col>
            </React.Fragment>)}
          <Col md={4} mdOffset={hasQuota ? 0 : 4}>
            <Card matchHeight>
              <CardBody>
                <CardTitle>Self-Installed Cluster</CardTitle>
                <p>
                  Install an OCP cluster manually, and manage it yourself.
                  Once installation is complete the cluster will get automatically
                  registered to the Cluster Manager.
                </p>
                {createSelfManaged}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardGrid>
    </EmptyState>
  );
}

ClusterListEmptyState.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
  hasQuota: PropTypes.bool,
};

export default ClusterListEmptyState;
