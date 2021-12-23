import PropTypes from 'prop-types';
import React from 'react';

import { Redirect } from 'react-router';

import {
  Banner,
  Wizard,
  PageSection,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

import PageTitle from '../../../common/PageTitle';
import ErrorModal from '../../../common/ErrorModal';
import Breadcrumbs from '../../../common/Breadcrumbs';

import { shouldRefetchQuota } from '../../../../common/helpers';

import ClusterSettingsScreen from '../../CreateOSDPage/CreateOSDWizard/ClusterSettingsScreen';
import MachinePoolScreen from '../../CreateOSDPage/CreateOSDWizard/MachinePoolScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import NetworkScreen from '../../CreateOSDPage/CreateOSDWizard/NetworkScreen';
import UpdatesScreen from '../../CreateOSDPage/CreateOSDWizard/UpdatesScreen';
import config from '../../../../config';
import Unavailable from '../../../common/Unavailable';

import './createROSAWizard.scss';
import AccountsRolesScreen from './AccountsRolesScreen';
import ClusterRolesScreen from './ClusterRolesScreen';
import ErrorBoundary from '../../../App/ErrorBoundary';

class CreateROSAWizard extends React.Component {
  state = {
    stepIdReached: 1,
  }

  componentDidMount() {
    const {
      machineTypes,
      organization,
      cloudProviders,
      getMachineTypes,
      getOrganizationAndQuota,
      getCloudProviders,
    } = this.props;

    document.title = 'Create OpenShift ROSA Cluster';

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
  }

  componentDidUpdate() {
    const {
      createClusterResponse, isErrorModalOpen, openModal,
    } = this.props;
    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }
  }

  componentWillUnmount() {
    const { resetResponse, resetForm } = this.props;
    resetResponse();
    resetForm();
  }

  onNext = ({ id }) => {
    const { stepIdReached } = this.state;
    if (id && stepIdReached < id) {
      this.setState({ stepIdReached: id });
    }
  };

  render() {
    const {
      isValid,
      onSubmit,
      product,
      cloudProviderID,
      createClusterResponse,
      machineTypes,
      organization,
      isErrorModalOpen,
      resetResponse,
      hasProductQuota,
      history,
    } = this.props;

    const { stepIdReached } = this.state;

    const steps = [
      {
        id: 1,
        name: 'Accounts and roles',
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen />
          </ErrorBoundary>
        ),
        enableNext: isValid,
      },
      {
        name: 'Cluster settings',
        steps: [
          {
            id: 2,
            name: 'Details',
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen
                  cloudProviderID={cloudProviderID}
                  product={product}
                />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 2,
          },
          {
            id: 3,
            name: 'Machine pool',
            component: (
              <ErrorBoundary>
                <MachinePoolScreen cloudProviderID={cloudProviderID} product={product} />
              </ErrorBoundary>
            ),
            enableNext: true, // TODO isValid,
            canJumpTo: stepIdReached >= 3,
          },
        ],
        enableNext: isValid,
      },
      {
        id: 4,
        name: 'Networking',
        steps: [
          {
            id: 5,
            name: 'Configuration',
            component: (
              <ErrorBoundary>
                <NetworkScreen cloudProviderID={cloudProviderID} product={product} />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 5,
          },
        ],
        enableNext: isValid,
      },
      {
        id: 6,
        name: 'Cluster updates',
        component: (
          <ErrorBoundary>
            <UpdatesScreen />
          </ErrorBoundary>
        ),
        enableNext: isValid,
        canJumpTo: stepIdReached >= 6,
      },
      {
        id: 7,
        name: 'Cluster roles and policies',
        component: (
          <ErrorBoundary>
            <ClusterRolesScreen />
          </ErrorBoundary>
        ),
        enableNext: isValid,
        canJumpTo: stepIdReached >= 7,
      },
      {
        id: 8,
        name: 'Review and create',
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen isPending={createClusterResponse.pending} />
          </ErrorBoundary>
        ),
        nextButtonText: 'Create cluster',
        enableNext: isValid && !createClusterResponse.pending,
        canJumpTo: stepIdReached >= 8 && isValid,
      },
    ];
    const ariaTitle = 'Create ROSA cluster wizard';

    const orgWasFetched = !organization.pending && organization.fulfilled;

    if (createClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/s/${createClusterResponse.cluster.subscription.id}`} />
      );
    }

    if (orgWasFetched
     && !hasProductQuota) {
      return (
        <Redirect to="/create" />
      );
    }

    const requests = [
      {
        data: machineTypes,
        name: 'Machine types',
      },
      {
        data: organization,
        name: 'Organization & Quota',
      },
    ];
    const anyRequestPending = requests.some(request => request.data.pending);

    const breadcrumbs = [
      { label: 'Clusters' },
      { label: 'Create', path: '/create' },
      { label: 'OpenShift ROSA Cluster' },
    ];

    const title = (
      <PageTitle
        title="Create a ROSA Cluster"
        breadcrumbs={(
          <Breadcrumbs path={breadcrumbs} />
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
          <PageSection>
            <Unavailable
              errors={
                requests
                  .filter(request => request.data.error)
                  .map(request => ({
                    key: request.name,
                    message: `Error while loading required form data (${request.name})`,
                    response: request.data,
                  }))
              }
            />
          </PageSection>
        </>
      );
    }

    const creationErrorModal = isErrorModalOpen && (
      <ErrorModal
        title="Error creating cluster"
        errorResponse={createClusterResponse}
        resetResponse={resetResponse}
      />
    );

    return (
      <>
        {title}
        <PageSection>
          {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
          <Banner variant="warning">
            On submit, a fake ROSA cluster will be created.
          </Banner>
          )}
          <div className="ocm-page">
            {creationErrorModal}
            <Wizard
              className="rosa-wizard"
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
              onSave={onSubmit}
              onNext={this.onNext}
              onBack={this.onBack}
              onGoToStep={this.onGoToStep}
              onClose={() => history.push('/create/cloud')}
            />
          </div>
        </PageSection>
      </>
    );
  }
}

const requestStatePropTypes = PropTypes.shape({
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  pending: PropTypes.bool,
});

CreateROSAWizard.propTypes = {
  isValid: PropTypes.bool,
  product: PropTypes.string,
  cloudProviderID: PropTypes.string,
  isErrorModalOpen: PropTypes.bool,

  createClusterResponse: PropTypes.shape({
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    pending: PropTypes.bool,
    cluster: PropTypes.shape({
      subscription: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
  machineTypes: requestStatePropTypes,
  organization: requestStatePropTypes,
  cloudProviders: requestStatePropTypes,

  getMachineTypes: PropTypes.func,
  getOrganizationAndQuota: PropTypes.func,
  getCloudProviders: PropTypes.func,

  resetResponse: PropTypes.func,
  resetForm: PropTypes.func,
  openModal: PropTypes.func,
  onSubmit: PropTypes.func,

  // for "no quota" redirect
  hasProductQuota: PropTypes.bool,

  // for cancel button
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateROSAWizard;
