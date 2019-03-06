// ClusterListEmptyState is the empty state (no clusters) for ClusterList
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button, Row, Col, EmptyState, Card, CardGrid, CardTitle, CardBody
} from 'patternfly-react';


function ClusterListEmptyState(props) {
  const { showCreationForm, showOCPCreationForm } = props;

  const createSelfManaged = (
    <EmptyState.Action>
      <Link to="/clusters/install">
        <Button bsStyle="primary" bsSize="large">
          Create Self-Managed (Manual) Cluster
        </Button>
      </Link>
    </EmptyState.Action>);

  const createAutoSelfManaged = (
    <EmptyState.Action>
      <Button bsStyle="primary" bsSize="large" onClick={showOCPCreationForm}>
        Create Self-Managed (Auto) Cluster
      </Button>
    </EmptyState.Action>
  );

  const createManaged = (
    <EmptyState.Action>
      <Button bsStyle="primary" bsSize="large" onClick={showCreationForm}>
        Create Red Hat-Managed Cluster
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
            <Col md={4}>
              <Card className="cluster-list-emptystate-preferred" accented matchHeight>
                <CardBody>
                  <p class="cluster-list-emptystate-preferred-string">Preferred method</p>
                  <CardTitle>Self-Managed (Manual Install) Cluster</CardTitle>
                  <p>
                    Create a self-managed cluster (OCP)
                    to install OpenShift and manage it yourself.
                    More information and better text should go here.
                  </p>
                  {createSelfManaged}
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card matchHeight>
                <CardBody>
                <CardTitle>Self-Managed (Auto-Install) Cluster</CardTitle>
                  <p>
                    Create a self-managed cluster (OCP)
                    to provision the cluster on Amazon Web Services and manage it yourself.
                    More information and better text should go here.
                  </p>
                  {createAutoSelfManaged}
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card matchHeight>
                <CardBody>
                <CardTitle>Red Hat-Managed Cluster</CardTitle>
                <p>
                  Create a Red Hat-managed cluster (OSD),
                  to provision the cluster on Amazon Web Services.
                  More information on this flow and why users would take this flow.
                </p>
                {createManaged}
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
  showOCPCreationForm: PropTypes.func.isRequired,
};


export default ClusterListEmptyState;
