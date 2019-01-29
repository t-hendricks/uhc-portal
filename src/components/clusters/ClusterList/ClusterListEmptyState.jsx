// ClusterListEmptyState is the empty state (no clusters) for ClusterList
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button, Grid, Row, Col, EmptyState,
} from 'patternfly-react';


function ClusterListEmptyState(props) {
  const { showCreationForm, showOCPCreationForm } = props;
  return (
    <EmptyState className="full-page-blank-slate">
      <Grid fluid>
        <Row>
          <EmptyState.Title>
            No Clusters Exist
          </EmptyState.Title>
          <EmptyState.Info>
            There are no clusters to display. Create a cluster to get started.
          </EmptyState.Info>
        </Row>
        <Row className="cluster-list-emptystate-options">
          <Col md={4}>
            <h2>Self-Managed (Manual Install) Cluster</h2>
            <p>
              Create a self-managed cluster (OCP)
              to install OpenShift and manage it yourself.
              More information and better text should go here.
            </p>
            <EmptyState.Action>
              <Link to="/clusters/install">
                <Button bsStyle="primary" bsSize="large">
                  Create Self-Managed (Manual) Cluster
                </Button>
              </Link>
            </EmptyState.Action>
          </Col>
          <Col md={4}>
            <h2>Self-Managed (Auto-Install) Cluster</h2>
            <p>
              Create a self-managed cluster (OCP)
              to provision the cluster on Amazon Web Services and manage it yourself.
              More information and better text should go here.
            </p>
            <EmptyState.Action>
              <Button bsSize="large" onClick={showOCPCreationForm}>
                Create Self-Managed (Auto) Cluster
              </Button>
            </EmptyState.Action>
          </Col>
          <Col md={4}>
            <h2>Red Hat-Managed Cluster</h2>
            <p>
              Create a Red Hat-managed cluster (OSD),
              to provision the cluster on Amazon Web Services.
              More information on this flow and why users would take this flow.
            </p>
            <EmptyState.Action>
              <Button bsSize="large" onClick={showCreationForm}>
                Create Red Hat-Managed Cluster
              </Button>
            </EmptyState.Action>
          </Col>
        </Row>
      </Grid>
    </EmptyState>
  );
}

ClusterListEmptyState.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
  showOCPCreationForm: PropTypes.func.isRequired,
};


export default ClusterListEmptyState;
