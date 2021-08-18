import PropTypes from 'prop-types';
import React from 'react';

import { Redirect } from 'react-router';

import {
  Banner,
  Wizard,
  Grid,
  PageSection,
  EmptyState,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

import PageTitle from '../../../common/PageTitle';
import ErrorModal from '../../../common/ErrorModal';
import ErrorBox from '../../../common/ErrorBox';
import Breadcrumbs from '../../../common/Breadcrumbs';

import { shouldRefetchQuota } from '../../../../common/helpers';

import BillingModelScreen from './BillingModelScreen';
import CloudProviderScreen from './CloudProviderScreen';
import ClusterSettingsScreen from './ClusterSettingsScreen';
import MachinePoolScreen from './MachinePoolScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import NetworkScreen from './NetworkScreen';
import UpdatesScreen from './UpdatesScreen';
import config from '../../../../config';

import { normalizedProducts } from '../../../../common/subscriptionTypes';

import './createOSDWizard.scss';

class CreateOSDWizard extends React.Component {
  state = { stepIdReached: 1 }

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

    document.title = 'Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager';

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

  componentDidUpdate() {
    const { createClusterResponse, isErrorModalOpen, openModal } = this.props;
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
      createClusterResponse,
      machineTypes,
      organization,
      cloudProviders,
      loadBalancerValues,
      persistentStorageValues,
      isErrorModalOpen,
      resetResponse,
      hasProductQuota,
      history,
      product, // for OSDTrial URL, prop from the router
    } = this.props;

    const { stepIdReached } = this.state;
    const isTrialDefault = product === normalizedProducts.OSDTrial;

    const steps = [
      {
        id: 1,
        name: 'Billing model',
        component: (
          <Grid>
            <BillingModelScreen isWizard isTrialDefault={isTrialDefault} />
          </Grid>
        ),
        enableNext: isValid,
      },
      {
        name: 'Cluster settings',
        steps: [
          {
            id: 2,
            name: 'Cloud provider',
            component: <CloudProviderScreen />,
            enableNext: isValid,
            canJumpTo: stepIdReached >= 2,
          },
          {
            id: 3,
            name: 'Cluster details',
            component: <ClusterSettingsScreen isTrialDefault={isTrialDefault} />,
            enableNext: isValid,
            canJumpTo: stepIdReached >= 3,
          },
          {
            id: 4,
            name: 'Machine pool',
            component: <MachinePoolScreen isTrialDefault={isTrialDefault} />,
            enableNext: isValid,
            canJumpTo: stepIdReached >= 4,
          },
        ],
        enableNext: isValid,
      },
      {
        id: 5,
        name: 'Networking',
        component: <NetworkScreen isTrialDefault={isTrialDefault} />,
        enableNext: isValid,
        canJumpTo: stepIdReached >= 5,
      },
      {
        id: 6,
        name: 'Updates',
        component: <UpdatesScreen />,
        enableNext: isValid,
        canJumpTo: stepIdReached >= 6,
      },
      {
        id: 7,
        name: 'Review and create',
        component: <ReviewClusterScreen isPending={createClusterResponse.pending} />,
        nextButtonText: 'Create cluster',
        enableNext: isValid && !createClusterResponse.pending,
        canJumpTo: stepIdReached >= 7 && isValid,
      },
    ];
    const ariaTitle = 'Create OpenShift Dedicated cluster wizard';

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
      {
        data: cloudProviders,
        name: 'Providers & Regions',
      },
      {
        data: loadBalancerValues,
        name: 'Load balancers',
      },
      {
        data: persistentStorageValues,
        name: 'Storage options',
      },
    ];
    const anyRequestPending = requests.some(request => request.data.pending);

    const breadcrumbs = [
      { label: 'Clusters' },
      { label: 'Create', path: '/create' },
      { label: 'OpenShift Dedicated', path: '/create/osd' },
    ];

    const title = (
      <PageTitle
        title="Create an OpenShift Dedicated Cluster"
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
          {title}
          <PageSection>
            <EmptyState variant="full">
              <Stack hasGutter>
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
          {config.fakeOSD && (
          <Banner variant="warning">
            On submit, a fake OSD cluster will be created.
          </Banner>
          )}
          <div className="ocm-page">
            {creationErrorModal}
            <Wizard
              className="osd-wizard"
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
              onSave={onSubmit}
              onNext={this.onNext}
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

CreateOSDWizard.propTypes = {
  isValid: PropTypes.bool,
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
  loadBalancerValues: requestStatePropTypes,
  persistentStorageValues: requestStatePropTypes,

  getMachineTypes: PropTypes.func,
  getOrganizationAndQuota: PropTypes.func,
  getCloudProviders: PropTypes.func,
  getLoadBalancers: PropTypes.func,
  getPersistentStorage: PropTypes.func,

  resetResponse: PropTypes.func,
  resetForm: PropTypes.func,
  openModal: PropTypes.func,
  onSubmit: PropTypes.func,

  // for "no quota" redirect
  hasProductQuota: PropTypes.bool,

  // for cancel button
  history: {
    push: PropTypes.func,
  },

  // for the /create/osdtrial url
  product: PropTypes.string,
};

export default CreateOSDWizard;
