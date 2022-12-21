import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Banner, Wizard, PageSection, WizardContext } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import config from '~/config';
import { shouldRefetchQuota, scrollToFirstError } from '~/common/helpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { trackEvents, ocmResourceType } from '~/common/analytics';
import withAnalytics from '~/hoc/withAnalytics';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import { stepId, stepNameById } from './rosaWizardConstants';

import ClusterSettingsScreen from '../../CreateOSDPage/CreateOSDWizard/ClusterSettingsScreen';
import MachinePoolScreen from '../../CreateOSDPage/CreateOSDWizard/MachinePoolScreen';
import NetworkScreen from '../../CreateOSDPage/CreateOSDWizard/NetworkScreen';
import VPCScreen from '../../CreateOSDPage/CreateOSDWizard/VPCScreen';
import ClusterProxyScreen from '../../CreateOSDPage/CreateOSDWizard/ClusterProxyScreen';
import CIDRScreen from '../../CreateOSDPage/CreateOSDWizard/CIDRScreen';
import UpdatesScreen from '../../CreateOSDPage/CreateOSDWizard/UpdatesScreen';
import ReviewClusterScreen from '../../CreateOSDPage/CreateOSDWizard/ReviewClusterScreen';

import PageTitle from '../../../common/PageTitle';
import Breadcrumbs from '../../../common/Breadcrumbs';
import Unavailable from '../../../common/Unavailable';
import CreateClusterErrorModal from '../../common/CreateClusterErrorModal';
import LeaveCreateClusterPrompt from '../../common/LeaveCreateClusterPrompt';
import ErrorBoundary from '../../../App/ErrorBoundary';
import ClusterRolesScreen from './ClusterRolesScreen';
import AccountsRolesScreen from './AccountsRolesScreen';
import { isUserRoleForSelectedAWSAccount } from './AccountsRolesScreen/AccountsRolesScreen';

import CreateRosaWizardFooter from './CreateRosaWizardFooter';

import './createROSAWizard.scss';

class CreateROSAWizardInternal extends React.Component {
  state = {
    stepIdReached: stepId.ACCOUNTS_AND_ROLES,
    currentStepId: stepId.ACCOUNTS_AND_ROLES,
    // Dictionary of step IDs; { [stepId: number]: boolean },
    // where entry values indicate the latest form validation state for those respective steps.
    validatedSteps: {},
  };

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

  componentDidUpdate(prevProps, prevState) {
    const { createClusterResponse, isErrorModalOpen, openModal, isValid } = this.props;
    const { currentStepId } = this.state;

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
    const { stepIdReached, currentStepId } = this.state;
    if (id && stepIdReached < id) {
      this.setState({ stepIdReached: id });
    }
    this.setState({ currentStepId: id });

    this.trackWizardNavigation(trackEvents.WizardNext, currentStepId);
  };

  onGoToStep = ({ id }) => {
    this.setState({ currentStepId: id });
    this.trackWizardNavigation(trackEvents.WizardLinkNav, id);
  };

  onBack = ({ id }) => {
    this.setState({ currentStepId: id });
    this.trackWizardNavigation(trackEvents.WizardBack, id);
  };

  canJumpTo = (id) => {
    const { stepIdReached, currentStepId, validatedSteps } = this.state;
    const { selectedAWSAccountID } = this.props;

    const hasPrevStepError = Object.entries(validatedSteps).some(
      ([validatedStepId, isStepValid]) => isStepValid === false && validatedStepId < id,
    );

    // disable all future wizard step links if no assoc. aws acct. selected
    if (id > stepId.ACCOUNTS_AND_ROLES && !selectedAWSAccountID) {
      return false;
    }

    // Allow step navigation forward when the current step is valid and backwards regardless.
    return (stepIdReached >= id && !hasPrevStepError) || id <= currentStepId;
  };

  getUserRoleInfo = () => {
    const { getUserRole } = this.props;
    return getUserRole();
  };

  scrolledToFirstError = () => {
    const { touch, formErrors } = this.props;
    const { validatedSteps, currentStepId } = this.state;
    const isCurrentStepValid = validatedSteps[currentStepId];
    const errorIds = Object.keys(formErrors);

    // When errors exist, touch the fields with those errors to trigger validation.
    if (errorIds?.length > 0 && !isCurrentStepValid) {
      touch(errorIds);
      scrollToFirstError(errorIds);
      return true;
    }
    return false;
  };

  onBeforeSubmit = (onSubmit) => {
    this.trackWizardNavigation(trackEvents.WizardSubmit);
    if (this.scrolledToFirstError()) {
      return;
    }
    onSubmit();
  };

  onBeforeNext = async (onNext) => {
    const { getUserRoleResponse, selectedAWSAccountID } = this.props;
    const { currentStepId } = this.state;

    if (this.scrolledToFirstError()) {
      return;
    }
    // when navigating back to step 1 from link in no user-role error messages on review screen
    // even though we're hitting [Next] on step 1, currentStepId is set to review step.
    // TODO: figure out how to update currentStepId externally from WizardContextConsumer.goToStepById()
    if (
      [stepId.ACCOUNTS_AND_ROLES, stepId.REVIEW_AND_CREATE].includes(currentStepId) &&
      !getUserRoleResponse?.fulfilled
    ) {
      const data = await this.getUserRoleInfo();
      const gotoNextStep = isUserRoleForSelectedAWSAccount(data.value, selectedAWSAccountID);
      if (!gotoNextStep) {
        return;
      }
    }
    onNext();
  };

  trackWizardNavigation = (event, currentStepId = '') => {
    const { track } = this.props;

    track(event, {
      resourceType: ocmResourceType.MOA,
      customProperties: {
        step_name: stepNameById[currentStepId],
      },
    });
  };

  render() {
    const {
      onSubmit,
      cloudProviderID,
      installToVPCSelected,
      createClusterResponse,
      machineTypes,
      organization,
      isErrorModalOpen,
      hasProductQuota,
      history,
      privateLinkSelected,
      configureProxySelected,
    } = this.props;

    const steps = [
      {
        id: stepId.ACCOUNTS_AND_ROLES,
        name: stepNameById[stepId.ACCOUNTS_AND_ROLES],
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen organizationID={organization?.details?.id} />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.ACCOUNTS_AND_ROLES),
      },
      {
        name: stepNameById[stepId.CLUSTER_SETTINGS],
        canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS),
        steps: [
          {
            id: stepId.CLUSTER_SETTINGS__DETAILS,
            name: stepNameById[stepId.CLUSTER_SETTINGS__DETAILS],
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.CLUSTER_SETTINGS__DETAILS),
          },
          {
            id: stepId.CLUSTER_SETTINGS__MACHINE_POOL,
            name: stepNameById[stepId.CLUSTER_SETTINGS__MACHINE_POOL],
            component: (
              <ErrorBoundary>
                <MachinePoolScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(22),
          },
        ],
      },
      {
        name: stepNameById[stepId.NETWORKING],
        canJumpTo: this.canJumpTo(stepId.NETWORKING),
        steps: [
          {
            id: stepId.NETWORKING__CONFIGURATION,
            name: stepNameById[stepId.NETWORKING__CONFIGURATION],
            component: (
              <ErrorBoundary>
                <NetworkScreen
                  cloudProviderID={cloudProviderID}
                  showClusterPrivacy
                  showVPCCheckbox
                  showClusterWideProxyCheckbox
                  privateLinkSelected={privateLinkSelected}
                  forcePrivateLink
                />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(stepId.NETWORKING__CONFIGURATION),
          },
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
        id: stepId.CLUSTER_ROLES_AND_POLICIES,
        name: stepNameById[stepId.CLUSTER_ROLES_AND_POLICIES],
        component: (
          <ErrorBoundary>
            <ClusterRolesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.CLUSTER_ROLES_AND_POLICIES),
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
            <WizardContext.Consumer>
              {({ goToStepById }) => (
                <ReviewClusterScreen
                  isCreateClusterPending={createClusterResponse.pending}
                  clusterRequestParams={{ isWizard: true }}
                  goToStepById={goToStepById}
                />
              )}
            </WizardContext.Consumer>
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.REVIEW_AND_CREATE),
      },
    ];
    const ariaTitle = 'Create ROSA cluster wizard';

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
    ];
    const anyRequestPending = requests.some((request) => request.data.pending);

    const breadcrumbs = [
      { label: 'Clusters' },
      { label: 'Cluster Type', path: '/create' },
      { label: 'Get Started with ROSA', path: '/create/rosa/getstarted' },
      { label: 'Create a ROSA Cluster' },
    ];

    const title = (
      <PageTitle title="Create a ROSA Cluster" breadcrumbs={<Breadcrumbs path={breadcrumbs} />} />
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

    return (
      <>
        {title}
        <PageSection>
          {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
            <Banner variant="warning">On submit, a fake ROSA cluster will be created.</Banner>
          )}
          <div className="ocm-page">
            {isErrorModalOpen && <CreateClusterErrorModal />}
            <Wizard
              className="rosa-wizard"
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
              isNavExpandable
              onNext={this.onNext}
              onBack={this.onBack}
              onGoToStep={this.onGoToStep}
              onClose={() => history.push('/')}
              footer={
                !createClusterResponse.pending ? (
                  <CreateRosaWizardFooter
                    onSubmit={onSubmit}
                    onBeforeNext={this.onBeforeNext}
                    onBeforeSubmit={this.onBeforeSubmit}
                  />
                ) : (
                  <></>
                )
              }
            />
          </div>
        </PageSection>
      </>
    );
  }
}

function CreateROSAWizard(props) {
  usePreventBrowserNav();

  return (
    <>
      <CreateROSAWizardInternal {...props} />
      <LeaveCreateClusterPrompt product={normalizedProducts.ROSA} />
    </>
  );
}

const requestStatePropTypes = PropTypes.shape({
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  pending: PropTypes.bool,
});

CreateROSAWizardInternal.propTypes = {
  isValid: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
  configureProxySelected: PropTypes.bool,
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
  getUserRole: PropTypes.func,
  getCloudProviders: PropTypes.func,

  resetResponse: PropTypes.func,
  resetForm: PropTypes.func,
  openModal: PropTypes.func,
  onSubmit: PropTypes.func,
  touch: PropTypes.func,
  formErrors: PropTypes.object,
  getUserRoleResponse: PropTypes.object,
  selectedAWSAccountID: PropTypes.string,

  // for "no quota" redirect
  hasProductQuota: PropTypes.bool,

  // for cancel button
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func,
  }).isRequired,
};

CreateROSAWizard.propTypes = { ...CreateROSAWizardInternal.propTypes };

export default withAnalytics(CreateROSAWizard);
