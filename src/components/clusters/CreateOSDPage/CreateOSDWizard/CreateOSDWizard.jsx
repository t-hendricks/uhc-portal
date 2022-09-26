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

import { trackEvents, ocmResourceTypeByProduct } from '~/common/analytics';
import withAnalytics from '~/hoc/withAnalytics';
import { stepId, stepNameById } from './osdWizardConstants';
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
    stepIdReached: stepId.BILLING_MODEL,
    currentStepId: stepId.BILLING_MODEL,
    // Dictionary of step IDs; { [stepId: number]: boolean },
    // where entry values indicate the latest form validation state for those respective steps.
    validatedSteps: {},
  };

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
    const { createClusterResponse, isErrorModalOpen, openModal, cloudProviderID, isValid, isCCS } =
      this.props;
    const { currentStepId, stepIdReached, validatedSteps } = this.state;
    const hasInvalidCpStep = !validatedSteps[stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER];

    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }

    // set [max] step reached to cloud providers step, to force users to go
    // through the steps again after changing cloud providers or infra type is updated to CCS.
    if (
      (stepIdReached > stepId.BILLING_MODEL && cloudProviderID !== prevProps.cloudProviderID) ||
      (isCCS && isCCS !== prevProps.isCCS)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ stepIdReached: stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER });
    }

    // If the cloud provider step was invalid prior to updating the infra type to
    // a RH cloud account, set step to be valid in the validatedSteps dictionary.
    if (hasInvalidCpStep && !isCCS && isCCS !== prevProps.isCCS) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({
        validatedSteps: {
          ...prevState.validatedSteps,
          [stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER]: true,
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
    this.trackWizardNavigation(trackEvents.WizardNext, id);
  };

  onGoToStep = ({ id }) => {
    this.setState({ currentStepId: id });
    this.trackWizardNavigation(trackEvents.WizardLinkNav, id);
  };

  onBack = ({ id }) => {
    this.setState({ currentStepId: id });
    this.trackWizardNavigation(trackEvents.WizardBack, id);
  };

  trackWizardNavigation = (event, currentStepId = '') => {
    const { track, product } = this.props;

    track(event, {
      resourceType: ocmResourceTypeByProduct[product],
      customProperties: {
        step_name: stepNameById[currentStepId],
      },
    });
  };

  canJumpTo = (id) => {
    const { stepIdReached, currentStepId, validatedSteps } = this.state;
    const hasPrevStepError = Object.entries(validatedSteps).some(
      ([validatedStepId, isStepValid]) => isStepValid === false && validatedStepId < id,
    );

    // Allow step navigation forward when the current step is valid and backwards regardless.
    return (stepIdReached >= id && !hasPrevStepError) || id <= currentStepId;
  };

  getCloudProverInfo = (cloudProviderID) => {
    const { ccsCredentials, getGCPCloudProviderVPCs, getAWSCloudProviderRegions } = this.props;

    if (cloudProviderID === 'gcp') {
      // hard code region since we're just validating credentials
      return getGCPCloudProviderVPCs(
        VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
        ccsCredentials,
        'us-east1',
      );
    }

    return getAWSCloudProviderRegions(ccsCredentials);
  };

  onBeforeNext = async (onNext) => {
    const { touch, formErrors, isCCSCredentialsValidationNeeded, cloudProviderID } = this.props;
    const { currentStepId, validatedSteps } = this.state;
    const isCurrentStepValid = validatedSteps[currentStepId];
    const errorFieldNames = Object.keys(formErrors);

    // When errors exist, touch the fields with those errors to trigger validation.
    if (errorFieldNames?.length > 0 && !isCurrentStepValid) {
      touch(errorFieldNames);
      scrollToFirstError(formErrors);
      return;
    }
    if (
      isCCSCredentialsValidationNeeded &&
      cloudProviderID &&
      currentStepId === stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER
    ) {
      // Only proceed to the next step if the validation is successful.
      await this.getCloudProverInfo(cloudProviderID);
    }
    // When no errors or validy checks are required, go to the next step.
    onNext();
  };

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
        id: stepId.BILLING_MODEL,
        name: stepNameById[stepId.BILLING_MODEL],
        component: (
          <ErrorBoundary>
            <Grid>
              <BillingModelScreen isTrialDefault={isTrialDefault} />
            </Grid>
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.BILLING_MODEL),
      },
      {
        name: stepNameById[stepId.CLUSTER_SETTINGS],
        canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS),
        steps: [
          {
            id: stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER,
            name: stepNameById[stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER],
            component: (
              <ErrorBoundary>
                <CloudProviderScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS__CLOUD_PROVIDER),
          },
          {
            id: stepId.CLUSTER_SETTINGS__DETAILS,
            name: stepNameById[stepId.CLUSTER_SETTINGS__DETAILS],
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen isTrialDefault={isTrialDefault} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS__DETAILS),
          },
          {
            id: stepId.CLUSTER_SETTINGS__MACHINE_POOL,
            name: stepNameById[stepId.CLUSTER_SETTINGS__MACHINE_POOL],
            component: (
              <ErrorBoundary>
                <MachinePoolScreen isTrialDefault={isTrialDefault} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS__MACHINE_POOL),
          },
        ],
      },
      {
        name: stepNameById[stepId.NETWORKING],
        canJumpTo: this.canJumpTo(stepId.NETWORKING),
        steps: [
          (showClusterPrivacy || showVPCCheckbox) && {
            id: stepId.NETWORKING__CONFIGURATION,
            name: stepNameById[stepId.NETWORKING__CONFIGURATION],
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
            canJumpTo: this.canJumpTo(stepId.NETWORKING__CONFIGURATION),
          },
          showVPCCheckbox &&
            installToVPCSelected && {
              id: stepId.NETWORKING__VPC_SETTINGS,
              name: stepNameById[stepId.NETWORKING__VPC_SETTINGS],
              component: (
                <ErrorBoundary>
                  <VPCScreen privateLinkSelected={privateLinkSelected} />
                </ErrorBoundary>
              ),
              canJumpTo: this.canJumpTo(stepId.NETWORKING__VPC_SETTINGS),
            },
          showVPCCheckbox &&
            configureProxySelected && {
              id: stepId.NETWORKING__CLUSTER_WIDE_PROXY,
              name: stepNameById[stepId.NETWORKING__CLUSTER_WIDE_PROXY],
              component: (
                <ErrorBoundary>
                  <ClusterProxyScreen />
                </ErrorBoundary>
              ),
              canJumpTo: this.canJumpTo(stepId.NETWORKING__CLUSTER_WIDE_PROXY),
            },
          {
            id: stepId.NETWORKING__CIDR_RANGES,
            name: stepNameById[stepId.NETWORKING__CIDR_RANGES],
            component: (
              <ErrorBoundary>
                <CIDRScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.NETWORKING__CIDR_RANGES),
          },
        ].filter(Boolean),
      },
      {
        id: stepId.CLUSTER_UPDATES,
        name: stepNameById[stepId.CLUSTER_UPDATES],
        component: (
          <ErrorBoundary>
            <UpdatesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.CLUSTER_UPDATES),
      },
      {
        id: stepId.REVIEW_AND_CREATE,
        name: stepNameById[stepId.REVIEW_AND_CREATE],
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen
              isPending={createClusterResponse.pending}
              clusterRequestParams={{ isWizard: true }}
            />
            {isErrorModalOpen && <CreateClusterErrorModal onRetry={onSubmit} />}
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.REVIEW_AND_CREATE),
      },
    ];
    const ariaTitle = 'Create OpenShift Dedicated cluster wizard';

    const orgWasFetched = !organization.pending && organization.fulfilled;

    if (createClusterResponse.fulfilled) {
      // When a cluster is successfully created,
      // unblock history in order to not show a confirmation prompt.
      history.block(() => {});

      return <Redirect to={`/details/s/${createClusterResponse.cluster.subscription.id}`} />;
    }

    if (orgWasFetched && !hasProductQuota) {
      return <Redirect to="/create" />;
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
    const anyRequestPending = requests.some((request) => request.data.pending);

    const breadcrumbs = [
      { label: 'Clusters' },
      { label: 'Create', path: '/create' },
      { label: 'OpenShift Dedicated', path: '/create/osd' },
    ];

    const title = (
      <PageTitle
        title="Create an OpenShift Dedicated Cluster"
        breadcrumbs={<Breadcrumbs path={breadcrumbs} />}
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

    const anyErrors = requests.some((request) => request.data.error);

    if (anyErrors) {
      return (
        <>
          <PageSection>
            <Unavailable
              errors={requests
                .filter((request) => request.data.error)
                .map((request) => ({
                  key: request.name,
                  message: `Error while loading required form data (${request.name})`,
                  response: request.data,
                }))}
            />
          </PageSection>
        </>
      );
    }

    const footer = (
      <WizardFooter>
        <WizardContext.Consumer>
          {({ activeStep, onNext, onBack, onClose }) => (
            <>
              {activeStep.id === stepId.REVIEW_AND_CREATE ? (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(event) => {
                    onSubmit(event);
                    this.trackWizardNavigation(trackEvents.WizardSubmit);
                  }}
                >
                  Create cluster
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => this.onBeforeNext(onNext)}
                  isLoading={ccsValidationPending}
                  isDisabled={ccsValidationPending}
                >
                  Next
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={activeStep.id === stepId.BILLING_MODEL}
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
            <Banner variant="warning">On submit, a fake OSD cluster will be created.</Banner>
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
              footer={createClusterResponse.pending ? <></> : footer}
            />
          </div>
        </PageSection>
      </>
    );
  }
}

function CreateOSDWizard(props) {
  usePreventBrowserNav();
  const { product } = props;

  return (
    <>
      <CreateOSDWizardInternal {...props} />
      <LeaveCreateClusterPrompt product={product} />
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
  track: PropTypes.func,

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

CreateOSDWizard.propTypes = CreateOSDWizardInternal.propTypes;

export default withAnalytics(CreateOSDWizard);
