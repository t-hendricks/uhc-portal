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
import CreateOSDClusterForm from './components/CreateOSDClusterForm';

class CreateOSDCluster extends React.Component {
  componentDidMount() {
    const {
      machineTypes, organization, cloudProviders,
      persistentStorageValues, loadBalancerValues,
      getMachineTypes, getOrganizationAndQuota, getCloudProviders,
      getLoadBalancers, getPersistentStorage,
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
    if (!persistentStorageValues.fulfilled && !persistentStorageValues.pending) {
      getPersistentStorage();
    }
    if (!loadBalancerValues.fulfilled && !loadBalancerValues.pending) {
      getLoadBalancers();
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
      machineTypes, organization, cloudProviders,
      loadBalancerValues, persistentStorageValues, isOpen,
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

    const requests = [machineTypes, organization,
      cloudProviders, loadBalancerValues, persistentStorageValues];
    const anyRequestPending = requests.some(request => request.pending);

    const title = (
      <PageTitle
        title="Create an OpenShift Dedicated Cluster"
        breadcrumbs={(
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
        )}
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

    if (anyRequestPending) {
      return (
        <React.Fragment>
          {title}
          <PageSection>
            <Spinner centered />
          </PageSection>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {title}
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page">
              {errorModal}
              <Form onSubmit={handleSubmit}>
                <Grid gutter="sm">
                  <CreateOSDClusterForm
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
      </React.Fragment>
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
  persistentStorageValues: PropTypes.object.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getLoadBalancers: PropTypes.func.isRequired,
  getPersistentStorage: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
};

export default CreateOSDCluster;
