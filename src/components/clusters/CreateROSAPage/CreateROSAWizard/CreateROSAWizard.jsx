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
import NetworkScreen from '../../CreateOSDPage/CreateOSDWizard/NetworkScreen';
import VPCScreen from '../../CreateOSDPage/CreateOSDWizard/VPCScreen';
import CIDRScreen from '../../CreateOSDPage/CreateOSDWizard/CIDRScreen';
import UpdatesScreen from '../../CreateOSDPage/CreateOSDWizard/UpdatesScreen';
import ReviewClusterScreen from '../../CreateOSDPage/CreateOSDWizard/ReviewClusterScreen';
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
      cloudProviderID,
      installToVPCSelected,
      createClusterResponse,
      machineTypes,
      organization,
      isErrorModalOpen,
      resetResponse,
      hasProductQuota,
      history,
      privateLinkSelected,
    } = this.props;
    const { stepIdReached } = this.state;

    const steps = [
      {
        id: 10,
        name: 'Accounts and roles',
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen organizationID={organization?.details?.id} />
          </ErrorBoundary>
        ),
        enableNext: isValid,
      },
      {
        name: 'Cluster settings',
        steps: [
          {
            id: 22,
            name: 'Details',
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 22,
          },
          {
            id: 23,
            name: 'Machine pool',
            component: (
              <ErrorBoundary>
                <MachinePoolScreen />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 23,
          },
        ],
        enableNext: isValid,
      },
      {
        name: 'Networking',
        enableNext: isValid,
        canJumpTo: stepIdReached >= 30,
        steps: [
          {
            id: 31,
            name: 'Configuration',
            component: (
              <ErrorBoundary>
                <NetworkScreen
                  cloudProviderID={cloudProviderID}
                  showClusterPrivacy
                  showVPCCheckbox
                  privateLinkSelected={privateLinkSelected}
                  forcePrivateLink
                />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 31,
          },
          installToVPCSelected && {
            id: 32,
            name: 'VPC settings',
            component: (
              <ErrorBoundary>
                <VPCScreen privateLinkSelected={privateLinkSelected} />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 32,
          },
          {
            id: 33,
            name: 'CIDR ranges',
            component: (
              <ErrorBoundary>
                <CIDRScreen />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 33,
          },
        ].filter(Boolean),
      },
      {
        id: 40,
        name: 'Cluster updates',
        component: (
          <ErrorBoundary>
            <UpdatesScreen />
          </ErrorBoundary>
        ),
        enableNext: isValid,
        canJumpTo: stepIdReached >= 40,
      },
      {
        id: 50,
        name: 'Cluster roles and policies',
        component: (
          <ErrorBoundary>
            <ClusterRolesScreen />
          </ErrorBoundary>
        ),
        enableNext: isValid,
        canJumpTo: stepIdReached >= 50,
      },
      {
        id: 100,
        name: 'Review and create',
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen
              isPending={createClusterResponse.pending}
              clusterRequestParams={{ isWizard: true }}
            />
          </ErrorBoundary>
        ),
        nextButtonText: 'Create cluster',
        enableNext: isValid && !createClusterResponse.pending,
        canJumpTo: stepIdReached >= 100 && isValid,
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
              isNavExpandable
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
  cloudProviderID: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
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
  organization: PropTypes.shape({
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    pending: PropTypes.bool,
    details: { id: PropTypes.string },
  }),
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
