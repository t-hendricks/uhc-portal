import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  Button,
  Card,
  Form,
  Grid,
  GridItem,
  Split,
  SplitItem,
  PageSection,
  EmptyState,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import { shouldRefetchQuota } from '../../../common/helpers';

import PageTitle from '../../common/PageTitle';
import ErrorModal from '../../common/ErrorModal';
import ErrorBox from '../../common/ErrorBox';
import Breadcrumbs from '../common/Breadcrumbs';
import CreateOSDForm from './CreateOSDForm';

class CreateOSDPage extends React.Component {
  state = {
    hasShownBYOCModal: false,
  }

  componentDidMount() {
    const {
      machineTypes,
      organization,
      cloudProviders,
      persistentStorageValues,
      loadBalancerValues,
      getMachineTypes,
      getOrganizationAndQuota,
      getCloudProviders,
      getLoadBalancers,
      getPersistentStorage,
    } = this.props;

    if (shouldRefetchQuota(organization)) {
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

  componentDidUpdate(prevProps) {
    const { hasShownBYOCModal } = this.state;

    const {
      createClusterResponse,
      isErrorModalOpen,
      clustersQuota,
      openModal,
      change,
      getOrganizationAndQuota,
      cloudProviderID,
    } = this.props;
    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }

    const hasAwsBYOCQuota = !!get(clustersQuota, 'aws.byoc.totalAvailable');
    const hasAwsRhInfradQuota = !!get(clustersQuota, 'aws.rhInfra.totalAvailable');

    // if user has only BYOC quota
    if (cloudProviderID === 'aws' && !prevProps.isBYOCModalOpen && !hasAwsRhInfradQuota && hasAwsBYOCQuota && !hasShownBYOCModal) {
      // open BYOC modal
      openModal('customer-cloud-subscription');
      // set byoc field value to true
      change('byoc', 'true');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasShownBYOCModal: true });
    }

    if (createClusterResponse.fulfilled && !prevProps.createClusterResponse.fulfilled) {
      getOrganizationAndQuota(); // re-fetch quota on successful cluster creation
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  reset() {
    const { resetResponse, resetForm } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
    const {
      handleSubmit,
      createClusterResponse,
      change,
      machineTypes,
      organization,
      cloudProviders,
      loadBalancerValues,
      persistentStorageValues,
      isErrorModalOpen,
      resetResponse,
      isBYOCModalOpen,
      openModal,
      closeModal,
      clustersQuota,
      cloudProviderID,
      privateClusterSelected,
    } = this.props;

    if (createClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/${createClusterResponse.cluster.id}`} />
      );
    }

    if (!organization.pending && organization.fulfilled && !clustersQuota.hasOsdQuota) {
      return (
        <Redirect to="/create" />
      );
    }

    if (!organization.pending && organization.fulfilled) {
      if ((cloudProviderID === 'gcp' && !clustersQuota.hasGcpQuota) || (cloudProviderID === 'aws' && !clustersQuota.hasAwsQuota)) {
        return (<Redirect to="/create/osd" />);
      }
    }

    const requests = [
      {
        data: machineTypes,
        name: 'Machine Types',
      },
      {
        data: organization,
        name: 'Organization & Quota',
      },
      {
        data: cloudProviders,
        name: 'Providers & Regions',
      },
      {
        data: loadBalancerValues,
        name: 'Load Balancers',
      },
      {
        data: persistentStorageValues,
        name: 'Storage options',
      },
    ];
    const anyRequestPending = requests.some(request => request.data.pending);

    const title = (
      <PageTitle
        title="Create an OpenShift Dedicated Cluster"
        breadcrumbs={(
          <Breadcrumbs path={[
            { label: 'Clusters' },
            { label: 'Create', path: '/create' },
            { label: 'OpenShift Dedicated', path: '/create/osd' },
            { label: cloudProviderID === 'aws' ? 'Amazon Web Services' : 'Google Cloud Platform' },
          ]}
          />
        )}
      />
    );

    if (anyRequestPending || (!organization.fulfilled && !organization.error)) {
      return (
        <>
          {title}
          <PageSection>
            <Spinner centered />
          </PageSection>
        </>
      );
    }

    const anyErrors = requests.some(request => request.data.error);

    if (anyErrors) {
      return (
        <>
          {title}
          <PageSection>
            <EmptyState variant="full">
              <Stack gutter="md">
                { requests.map(request => request.data.error && (
                <StackItem key={request.name}>
                  <ErrorBox
                    message={`Error while loading required form data (${request.name})`}
                    response={request.data}
                  />
                </StackItem>
                ))}
              </Stack>
            </EmptyState>
          </PageSection>
        </>
      );
    }

    const loadingSpinner = createClusterResponse.pending ? (
      <div className="form-loading-spinner">
        <span>
         Do not refresh this page. This request may take a moment...
        </span>
        <Spinner />
      </div>
    ) : null;

    const creationErrorModal = isErrorModalOpen && (
      <ErrorModal
        title="Error Creating Cluster"
        errorResponse={createClusterResponse}
        resetResponse={resetResponse}
      />
    );

    return (
      <>
        {title}
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page">
              {creationErrorModal}
              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <Grid gutter="sm">
                  <CreateOSDForm
                    pending={createClusterResponse.pending}
                    change={change}
                    isBYOCModalOpen={isBYOCModalOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    clustersQuota={clustersQuota}
                    cloudProviderID={cloudProviderID}
                    privateClusterSelected={privateClusterSelected}
                  />
                  {/* Form footer */}
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
                        {loadingSpinner}
                      </SplitItem>
                    </Split>
                  </GridItem>
                </Grid>
              </Form>
            </div>
          </Card>
        </PageSection>
      </>
    );
  }
}

CreateOSDPage.propTypes = {
  isErrorModalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clustersQuota: PropTypes.shape({
    hasOsdQuota: PropTypes.bool.isRequired,
    hasAwsQuota: PropTypes.bool.isRequired,
    hasGcpQuota: PropTypes.bool.isRequired,
    aws: PropTypes.shape({
      byoc: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
    gcp: PropTypes.shape({
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
  }),
  isBYOCModalOpen: PropTypes.bool.isRequired,
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
  cloudProviderID: PropTypes.string.isRequired,
  privateClusterSelected: PropTypes.bool.isRequired,
};

export default CreateOSDPage;
