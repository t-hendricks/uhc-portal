import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Form,
  Grid,
  GridItem,
  Split,
  SplitItem,
  PageSection,
} from '@patternfly/react-core';

import PageTitle from '../../common/PageTitle';
import ErrorModal from '../../common/ErrorModal';
import constants from './CreateOSDClusterHelper';
import ManagedClusterForm from './ManagedClusterForm';

class CreateOSDCluster extends React.Component {
  componentDidMount() {
    const {
      machineTypes, organization, cloudProviders,
      getMachineTypes, getOrganizationAndQuota, getCloudProviders,
    } = this.props;

    this.reset();
    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
  }

  componentDidUpdate() {
    const { createClusterResponse, openModal, isOpen } = this.props;
    if (createClusterResponse.error && !isOpen) {
      openModal();
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  reset() {
    const {
      resetResponse, resetForm,
    } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
    const {
      handleSubmit, createClusterResponse, change,
      machineTypes, organization, cloudProviders, isOpen,
      resetResponse,
    } = this.props;

    if (createClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/${createClusterResponse.cluster.id}`} />
      );
    }

    const errorModal = isOpen && (
      <ErrorModal
        title="Error Creating Cluster"
        errorResponse={createClusterResponse}
        resetResponse={resetResponse}
      />
    );

    const loadingSpinner = () => (
      <div className="form-loading-spinner">
        <span>
          {constants.spinnerMessage}
        </span>
        <Spinner />
      </div>
    );

    if (machineTypes.pending || organization.pending || cloudProviders.pending) {
      return <PageSection><Spinner centered /></PageSection>;
    }

    return (
      <PageSection>
        <Card>
          <div className="pf-c-content ocm-page">
            <Breadcrumb className="breadcrumbs-in-card">
              <LinkContainer to="">
                <BreadcrumbItem to="#">
                  Clusters
                </BreadcrumbItem>
              </LinkContainer>
              <LinkContainer to="/create">
                <BreadcrumbItem to="#">
                  Create
                </BreadcrumbItem>
              </LinkContainer>
              <BreadcrumbItem isActive>
                OpenShift Dedicated
              </BreadcrumbItem>
            </Breadcrumb>

            <PageTitle title="Create an OpenShift Dedicated Cluster" />
            {errorModal}
            <Form onSubmit={handleSubmit}>
              <Grid gutter="sm">
                <ManagedClusterForm
                  pending={createClusterResponse.pending}
                  change={change}
                />
                <GridItem>
                  <Split gutter="sm" className="create-osd-form-button-split">
                    <SplitItem>
                      <Button variant="primary" type="submit" onClick={handleSubmit} isDisabled={createClusterResponse.pending}>
                        Create cluster
                      </Button>
                    </SplitItem>
                    <SplitItem>
                      <Link to="/">
                        <Button variant="secondary" isDisabled={createClusterResponse.pending}>
                          Cancel
                        </Button>
                      </Link>
                    </SplitItem>
                    <SplitItem>
                      {createClusterResponse.pending ? loadingSpinner() : null}
                    </SplitItem>
                  </Split>
                </GridItem>

              </Grid>
            </Form>

          </div>
        </Card>
      </PageSection>
    );
  }
}
CreateOSDCluster.propTypes = {
  isOpen: PropTypes.bool,
  openModal: PropTypes.func,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
  change: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
};

export default CreateOSDCluster;
