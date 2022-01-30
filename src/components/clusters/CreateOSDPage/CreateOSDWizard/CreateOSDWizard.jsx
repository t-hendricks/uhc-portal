import PropTypes from 'prop-types';
import React from 'react';

import { Redirect } from 'react-router';

import {
  Banner,
  Wizard,
  Grid,
  PageSection,
  WizardFooter,
  Button,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

import ErrorBoundary from '../../../App/ErrorBoundary';
import PageTitle from '../../../common/PageTitle';
import ErrorModal from '../../../common/ErrorModal';
import Breadcrumbs from '../../../common/Breadcrumbs';

import { shouldRefetchQuota } from '../../../../common/helpers';

import BillingModelScreen from './BillingModelScreen';
import CloudProviderScreen from './CloudProviderScreen';
import ClusterSettingsScreen from './ClusterSettingsScreen';
import MachinePoolScreen from './MachinePoolScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import NetworkScreen from './NetworkScreen';
import VPCScreen from './VPCScreen';
import CIDRScreen from './CIDRScreen';
import UpdatesScreen from './UpdatesScreen';
import config from '../../../../config';
import Unavailable from '../../../common/Unavailable';

import { normalizedProducts } from '../../../../common/subscriptionTypes';
import { VALIDATE_CLOUD_PROVIDER_CREDENTIALS } from './ccsInquiriesActions';

import './createOSDWizard.scss';

class CreateOSDWizard extends React.Component {
  state = {
    stepIdReached: 1,
    currentStep: 1,
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

  componentDidUpdate(prevProps) {
    const {
      createClusterResponse, isErrorModalOpen, openModal, isCCSCredentialsValidationNeeded,
    } = this.props;
    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }
    if (isCCSCredentialsValidationNeeded && !prevProps.isCCSCredentialsValidationNeeded) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ stepIdReached: 2 }); // prevent going to next steps when validation is needed
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
    this.setState({ currentStep: id });
  };

  onGoToStep = ({ id }) => {
    this.setState({ currentStep: id });
  }

  onBack = ({ id }) => {
    this.setState({ currentStep: id });
  }

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
      ccsValidationPending,
      isCCS,
      isCCSCredentialsValidationNeeded,
      cloudProviderID,
      ccsCredentials,
      installToVPCSelected,
      getGCPCloudProviderVPCs,
      getAWSCloudProviderRegions,
      privateLinkSelected,
    } = this.props;

    const { stepIdReached, currentStep } = this.state;
    const isTrialDefault = product === normalizedProducts.OSDTrial;

    const isAws = cloudProviderID === 'aws';
    const isGCP = cloudProviderID === 'gcp';
    const showClusterPrivacy = isAws || (isGCP && isCCS);
    const showVPCCheckbox = isCCS;

    const steps = [
      {
        id: 10,
        name: 'Billing model',
        component: (
          <ErrorBoundary>
            <Grid>
              <BillingModelScreen isWizard isTrialDefault={isTrialDefault} />
            </Grid>
          </ErrorBoundary>
        ),
        enableNext: isValid,
      },
      {
        name: 'Cluster settings',
        steps: [
          {
            id: 21,
            name: 'Cloud provider',
            component: (
              <ErrorBoundary>
                <CloudProviderScreen />
              </ErrorBoundary>
            ),
            enableNext: isValid && !ccsValidationPending,
            canJumpTo: stepIdReached >= 21,
          },
          {
            id: 22,
            name: 'Details',
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen isTrialDefault={isTrialDefault} />
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
                <MachinePoolScreen isTrialDefault={isTrialDefault} />
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
          (showClusterPrivacy || showVPCCheckbox) && {
            id: 31,
            name: 'Configuration',
            component: (
              <ErrorBoundary>
                <NetworkScreen
                  isTrialDefault={isTrialDefault}
                  showClusterPrivacy={showClusterPrivacy}
                  showVPCCheckbox={showVPCCheckbox}
                  privateLinkSelected={privateLinkSelected}
                />
              </ErrorBoundary>
            ),
            enableNext: isValid,
            canJumpTo: stepIdReached >= 31,
          },
          showVPCCheckbox && installToVPCSelected && {
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
    const controlledFooter = isCCSCredentialsValidationNeeded
                             && !!cloudProviderID
                             && currentStep === 21;

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
              isNavExpandable
              onSave={onSubmit}
              onNext={this.onNext}
              onBack={this.onBack}
              onGoToStep={this.onGoToStep}
              onClose={() => history.push('/create/cloud')}
              /* custom footer is needed to prevent advancing to the next screen
                 before validating CCS credentials :( */
              footer={controlledFooter ? (
                <WizardFooter>
                  <Button
                    variant="primary"
                    isDisabled={!isValid || ccsValidationPending}
                    onClick={() => {
                      if (cloudProviderID === 'gcp') {
                        // hard code region since we're just validating credentials
                        getGCPCloudProviderVPCs(VALIDATE_CLOUD_PROVIDER_CREDENTIALS, ccsCredentials, 'us-east1');
                      } else {
                        getAWSCloudProviderRegions(ccsCredentials);
                      }
                    }}
                    isLoading={ccsValidationPending}
                  >
                    Validate
                  </Button>
                </WizardFooter>
              ) : undefined}
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
  ccsValidationPending: PropTypes.bool,
  isCCS: PropTypes.bool,
  isCCSCredentialsValidationNeeded: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isErrorModalOpen: PropTypes.bool,
  ccsCredentials: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,

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
  getGCPCloudProviderVPCs: PropTypes.func,
  getAWSCloudProviderRegions: PropTypes.func,

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

  // for the /create/osdtrial url
  product: PropTypes.string,
};

export default CreateOSDWizard;
