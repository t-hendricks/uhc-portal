import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router';

import {
  Banner,
  Wizard,
  Grid,
  PageSection,
  WizardFooter,
  WizardContext,
  Button,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

import ErrorBoundary from '../../../App/ErrorBoundary';
import PageTitle from '../../../common/PageTitle';
import Breadcrumbs from '../../../common/Breadcrumbs';

import { shouldRefetchQuota, scrollToFirstError } from '../../../../common/helpers';
import usePreventBrowserNav from '../../../../hooks/usePreventBrowserNav';

import BillingModelScreen from './BillingModelScreen';
import CloudProviderScreen from './CloudProviderScreen';
import ClusterSettingsScreen from './ClusterSettingsScreen';
import MachinePoolScreen from './MachinePoolScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import NetworkScreen from './NetworkScreen';
import VPCScreen from './VPCScreen';
import ClusterProxyScreen from './ClusterProxyScreen';
import CIDRScreen from './CIDRScreen';
import UpdatesScreen from './UpdatesScreen';
import config from '../../../../config';
import Unavailable from '../../../common/Unavailable';
import CreateClusterErrorModal from '../../common/CreateClusterErrorModal';
import LeaveCreateClusterPrompt from '../../common/LeaveCreateClusterPrompt';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import { VALIDATE_CLOUD_PROVIDER_CREDENTIALS } from './ccsInquiriesActions';

import './createOSDWizard.scss';

class CreateOSDWizardInternal extends React.Component {
  state = {
    stepIdReached: 10,
    currentStepId: 10,
    // Dictionary of step IDs; { [stepId: number]: boolean },
    // where entry values indicate the latest form validation state for those respective steps.
    validatedSteps: {},
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
      resetForm,
    } = this.props;

    /* Reset the form in the event the user had already loaded the ROSA wizard
       and experienced form errors.
     */
    resetForm();

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

  componentDidUpdate(prevProps, prevState) {
    const {
      createClusterResponse,
      isErrorModalOpen,
      openModal,
      cloudProviderID,
      isValid,
      isCCS,
    } = this.props;
    const { currentStepId, stepIdReached, validatedSteps } = this.state;
    const hasInvalidCpStep = !validatedSteps[21];

    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }

    // set [max] step reached to cloud providers step, to force users to go
    // through the steps again after changing cloud providers or infra type is updated to CCS.
    if (
      (stepIdReached > 10 && cloudProviderID !== prevProps.cloudProviderID)
      || (isCCS && isCCS !== prevProps.isCCS)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ stepIdReached: 21 });
    }

    // If the cloud provider step was invalid prior to updating the infra type to
    // a RH cloud account, set step to be valid in the validatedSteps dictionary.
    if (hasInvalidCpStep && (!isCCS && isCCS !== prevProps.isCCS)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({
        validatedSteps: {
          ...prevState.validatedSteps,
          21: true,
        },
      }));
    }

    // Track validity of individual steps by id
    if (isValid !== prevProps.isValid) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({
        validatedSteps: {
          ...prevState.validatedSteps,
          [currentStepId]: isValid,
        },
      }));
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
    this.setState({ currentStepId: id });
  };

  onGoToStep = ({ id }) => {
    this.setState({ currentStepId: id });
  }

  onBack = ({ id }) => {
    this.setState({ currentStepId: id });
  }

  canJumpTo = (id) => {
    const { stepIdReached, currentStepId, validatedSteps } = this.state;
    const hasPrevStepError = Object.entries(validatedSteps).some((
      [validatedStepId, isStepValid],
    ) => (
      isStepValid === false && validatedStepId < id
    ));

    // Allow step navigation forward when the current step is valid and backwards regardless.
    return (stepIdReached >= id && !hasPrevStepError) || id <= currentStepId;
  }

  getCloudProverInfo = (cloudProviderID) => {
    const { ccsCredentials, getGCPCloudProviderVPCs, getAWSCloudProviderRegions } = this.props;

    if (cloudProviderID === 'gcp') {
      // hard code region since we're just validating credentials
      return getGCPCloudProviderVPCs(VALIDATE_CLOUD_PROVIDER_CREDENTIALS, ccsCredentials, 'us-east1');
    }

    return getAWSCloudProviderRegions(ccsCredentials);
  }

  beforeOnNext = async (onNext) => {
    const {
      touch,
      formErrors,
      isCCSCredentialsValidationNeeded,
      cloudProviderID,
    } = this.props;
    const { currentStepId, validatedSteps } = this.state;
    const isCurrentStepValid = validatedSteps[currentStepId];
    const errorFieldNames = Object.keys(formErrors);

    // When errors exist, touch the fields with those errors to trigger validation.
    if (errorFieldNames?.length > 0 && !isCurrentStepValid) {
      touch(errorFieldNames);
      scrollToFirstError(formErrors);
    } else if (isCCSCredentialsValidationNeeded && cloudProviderID && currentStepId === 21) {
      // Only proceed to the next step if the validation is successful.
      await this.getCloudProverInfo(cloudProviderID);
      onNext();
    } else {
      // When no errors or validy checks are required, go to the next step.
      onNext();
    }
  }

  render() {
    const {
      onSubmit,
      createClusterResponse,
      machineTypes,
      organization,
      cloudProviders,
      loadBalancerValues,
      persistentStorageValues,
      isErrorModalOpen,
      hasProductQuota,
      history,
      product, // for OSDTrial URL, prop from the router
      isCCS,
      cloudProviderID,
      installToVPCSelected,
      privateLinkSelected,
      configureProxySelected,
      ccsCredentialsValidityResponse,
    } = this.props;

    const isTrialDefault = product === normalizedProducts.OSDTrial;

    const isAws = cloudProviderID === 'aws';
    const isGCP = cloudProviderID === 'gcp';
    const showClusterPrivacy = isAws || (isGCP && isCCS);
    const showVPCCheckbox = isCCS;
    const ccsValidationPending = ccsCredentialsValidityResponse?.pending;

    const steps = [
      {
        id: 10,
        name: 'Billing model',
        component: (
          <ErrorBoundary>
            <Grid>
              <BillingModelScreen isTrialDefault={isTrialDefault} />
            </Grid>
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(10),
      },
      {
        name: 'Cluster settings',
        canJumpTo: this.canJumpTo(20),
        steps: [
          {
            id: 21,
            name: 'Cloud provider',
            component: (
              <ErrorBoundary>
                <CloudProviderScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(21),
          },
          {
            id: 22,
            name: 'Details',
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen isTrialDefault={isTrialDefault} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(22),
          },
          {
            id: 23,
            name: 'Machine pool',
            component: (
              <ErrorBoundary>
                <MachinePoolScreen isTrialDefault={isTrialDefault} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(23),
          },
        ],
      },
      {
        name: 'Networking',
        canJumpTo: this.canJumpTo(30),
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
            canJumpTo: this.canJumpTo(31),
          },
          showVPCCheckbox && installToVPCSelected && {
            id: 32,
            name: 'VPC settings',
            component: (
              <ErrorBoundary>
                <VPCScreen privateLinkSelected={privateLinkSelected} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(32),
          },
          showVPCCheckbox && configureProxySelected && {
            id: 33,
            name: 'Cluster-wide proxy',
            component: (
              <ErrorBoundary>
                <ClusterProxyScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(33),
          },
          {
            id: 34,
            name: 'CIDR ranges',
            component: (
              <ErrorBoundary>
                <CIDRScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(34),
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
        canJumpTo: this.canJumpTo(40),
      },
      {
        id: 50,
        name: 'Review and create',
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen
              isPending={createClusterResponse.pending}
              clusterRequestParams={{ isWizard: true }}
            />
            {isErrorModalOpen && <CreateClusterErrorModal onRetry={onSubmit} />}
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(50),
      },
    ];
    const ariaTitle = 'Create OpenShift Dedicated cluster wizard';

    const orgWasFetched = !organization.pending && organization.fulfilled;

    if (createClusterResponse.fulfilled) {
      // When a cluster is successfully created,
      // unblock history in order to not show a confirmation prompt.
      history.block(() => {});

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

    const footer = (
      <WizardFooter>
        <WizardContext.Consumer>
          {({
            activeStep,
            onNext,
            onBack,
            onClose,
          }) => (
            <>
              {activeStep.name === 'Review and create'
                ? <Button variant="primary" type="submit" onClick={onSubmit}>Create Cluster</Button>
                : (
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={() => this.beforeOnNext(onNext)}
                    isLoading={ccsValidationPending}
                    isDisabled={ccsValidationPending}
                  >
                    Next
                  </Button>
                )}
              <Button
                variant="secondary"
                onClick={onBack}
                {...activeStep.name === 'Billing model' && { isDisabled: true }}
              >
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          )}
        </WizardContext.Consumer>
      </WizardFooter>
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
            <Wizard
              className="osd-wizard"
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
              isNavExpandable
              onNext={this.onNext}
              onBack={this.onBack}
              onGoToStep={this.onGoToStep}
              onClose={() => history.push('/create/cloud')}
              footer={footer}
            />
          </div>
        </PageSection>
      </>
    );
  }
}

function CreateOSDWizard(props) {
  usePreventBrowserNav();

  return (
    <>
      <CreateOSDWizardInternal {...props} />
      <LeaveCreateClusterPrompt />
    </>
  );
}

const requestStatePropTypes = PropTypes.shape({
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  pending: PropTypes.bool,
});

CreateOSDWizardInternal.propTypes = {
  isValid: PropTypes.bool,
  ccsCredentialsValidityResponse: PropTypes.object,
  isCCS: PropTypes.bool,
  isCCSCredentialsValidationNeeded: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isErrorModalOpen: PropTypes.bool,
  ccsCredentials: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
  configureProxySelected: PropTypes.bool,

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
  touch: PropTypes.func,
  formErrors: PropTypes.object,

  // for "no quota" redirect
  hasProductQuota: PropTypes.bool,

  // for cancel button
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func,
  }).isRequired,

  // for the /create/osdtrial url
  product: PropTypes.string,
};

export default CreateOSDWizard;
