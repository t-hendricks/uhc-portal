import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Banner, Wizard, PageSection } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import config from '../../../../config';
import {
  shouldRefetchQuota,
  scrollToFirstError,
  getTrackEvent,
  ocmResourceType,
} from '../../../../common/helpers';
import { persistor } from '../../../../redux/store';
import usePreventBrowserNav from '../../../../hooks/usePreventBrowserNav';

import ClusterSettingsScreen from '../../CreateOSDPage/CreateOSDWizard/ClusterSettingsScreen';
import MachinePoolScreen from '../../CreateOSDPage/CreateOSDWizard/MachinePoolScreen';
import NetworkScreen from '../../CreateOSDPage/CreateOSDWizard/NetworkScreen';
import VPCScreen from '../../CreateOSDPage/CreateOSDWizard/VPCScreen';
import ClusterProxyScreen from '../../CreateOSDPage/CreateOSDWizard/ClusterProxyScreen';
import CIDRScreen from '../../CreateOSDPage/CreateOSDWizard/CIDRScreen';
import UpdatesScreen from '../../CreateOSDPage/CreateOSDWizard/UpdatesScreen';
import ReviewClusterScreen from '../../CreateOSDPage/CreateOSDWizard/ReviewClusterScreen';

import withAnalytics from '../../../../hoc/withAnalytics';
import Unavailable from '../../../common/Unavailable';
import PageTitle from '../../../common/PageTitle';
import Breadcrumbs from '../../../common/Breadcrumbs';
import CreateClusterErrorModal from '../../common/CreateClusterErrorModal';
import LeaveCreateClusterPrompt from '../../common/LeaveCreateClusterPrompt';
import ErrorBoundary from '../../../App/ErrorBoundary';
import ClusterRolesScreen from './ClusterRolesScreen';
import AccountsRolesScreen from './AccountsRolesScreen';
import CreateRosaWizardFooter from './CreateRosaWizardFooter';

import './createROSAWizard.scss';

class CreateROSAWizardInternal extends React.Component {
  static stepId = {
    ACCOUNTS_AND_ROLES: 10,
    CLUSTER_SETTINGS: 20,
    CLUSTER_SETTINGS__DETAILS: 21,
    CLUSTER_SETTINGS__MACHINE_POOL: 23,
    NETWORKING: 30,
    NETWORKING__CONFIGURATION: 31,
    NETWORKING__VPC_SETTINGS: 32,
    NETWORKING__CLUSTER_WIDE_PROXY: 33,
    NETWORKING__CIDR_RANGES: 34,
    CLUSTER_ROLES_AND_POLICIES: 40,
    CLUSTER_UPDATES: 50,
    REVIEW_AND_CREATE: 60,
  }

  static stepNameById = {
    [CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES]: 'Accounts and roles',
    [CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS]: 'Cluster settings',
    [CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__DETAILS]: 'Details',
    [CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__MACHINE_POOL]: 'Machine pool',
    [CreateROSAWizardInternal.stepId.NETWORKING]: 'Networking',
    [CreateROSAWizardInternal.stepId.NETWORKING__CONFIGURATION]: 'Configuration',
    [CreateROSAWizardInternal.stepId.NETWORKING__VPC_SETTINGS]: 'VPC settings',
    [CreateROSAWizardInternal.stepId.NETWORKING__CLUSTER_WIDE_PROXY]: 'Cluster-wide proxy',
    [CreateROSAWizardInternal.stepId.NETWORKING__CIDR_RANGES]: 'CIDR ranges',
    [CreateROSAWizardInternal.stepId.CLUSTER_ROLES_AND_POLICIES]: 'Cluster roles and policies',
    [CreateROSAWizardInternal.stepId.CLUSTER_UPDATES]: 'Cluster updates',
    [CreateROSAWizardInternal.stepId.REVIEW_AND_CREATE]: 'Review and create',
  }

  state = {
    stepIdReached: CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES,
    currentStepId: CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES,
    // Dictionary of step IDs; { [stepId: number]: boolean },
    // where entry values indicate the latest form validation state for those respective steps.
    validatedSteps: {},
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

  componentDidUpdate(prevProps, prevState) {
    const {
      createClusterResponse,
      isErrorModalOpen,
      openModal,
      isValid,
    } = this.props;
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

    this.trackWizardNavigation('WizardNext', currentStepId);
  };

  onGoToStep = ({ id }) => this.setState({ currentStepId: id });

  onBack = ({ id }) => this.setState({ currentStepId: id });

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

  getUserRoleInfo = () => {
    const { getUserRole } = this.props;
    return getUserRole();
  }

  onBeforeSubmit = (onSubmit) => {
    this.trackWizardNavigation('WizardEnd');
    onSubmit();
  }

  onBeforeNext = async (onNext) => {
    const {
      touch, formErrors, getUserRoleResponse,
    } = this.props;
    const { validatedSteps, currentStepId } = this.state;
    const isCurrentStepValid = validatedSteps[currentStepId];
    const errorFieldNames = Object.keys(formErrors);

    // When errors exist, touch the fields with those errors to trigger validation.
    if (errorFieldNames?.length > 0 && !isCurrentStepValid) {
      touch(errorFieldNames);
      scrollToFirstError(formErrors);
      return;
    }
    if (currentStepId === CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES
      && !getUserRoleResponse?.fulfilled) {
      await this.getUserRoleInfo();
    }
    onNext();
  }

  trackWizardNavigation = (eventKey, currentStepId = '') => {
    const { analytics } = this.props;

    const eventObj = getTrackEvent(
      eventKey,
      null,
      undefined,
      ocmResourceType.MOA,
      {
        step: {
          id: currentStepId,
          name: CreateROSAWizardInternal.stepNameById[currentStepId],
        },
      },
    );
    analytics.track(eventObj.event, eventObj.properties);
  }

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
        id: CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES,
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES],
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen organizationID={organization?.details?.id} />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.ACCOUNTS_AND_ROLES),
      },
      {
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS],
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS),
        steps: [
          {
            id: CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__DETAILS,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__DETAILS],
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__DETAILS),
          },
          {
            id: CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__MACHINE_POOL,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.CLUSTER_SETTINGS__MACHINE_POOL],
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
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.NETWORKING],
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.NETWORKING),
        steps: [
          {
            id: CreateROSAWizardInternal.stepId.NETWORKING__CONFIGURATION,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.NETWORKING__CONFIGURATION],
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
            canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.NETWORKING__CONFIGURATION),
          },
          installToVPCSelected && {
            id: CreateROSAWizardInternal.stepId.NETWORKING__VPC_SETTINGS,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.NETWORKING__VPC_SETTINGS],
            component: (
              <ErrorBoundary>
                <VPCScreen privateLinkSelected={privateLinkSelected} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.NETWORKING__VPC_SETTINGS),
          },
          configureProxySelected && {
            id: CreateROSAWizardInternal.stepId.NETWORKING__CLUSTER_WIDE_PROXY,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.NETWORKING__CLUSTER_WIDE_PROXY],
            component: (
              <ErrorBoundary>
                <ClusterProxyScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(
              CreateROSAWizardInternal.stepId.NETWORKING__CLUSTER_WIDE_PROXY,
            ),
          },
          {
            id: CreateROSAWizardInternal.stepId.NETWORKING__CIDR_RANGES,
            name: CreateROSAWizardInternal.stepNameById[
              CreateROSAWizardInternal.stepId.NETWORKING__CIDR_RANGES],
            component: (
              <ErrorBoundary>
                <CIDRScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.NETWORKING__CIDR_RANGES),
          },
        ].filter(Boolean),
      },
      {
        id: CreateROSAWizardInternal.stepId.CLUSTER_ROLES_AND_POLICIES,
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.CLUSTER_ROLES_AND_POLICIES],
        component: (
          <ErrorBoundary>
            <ClusterRolesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.CLUSTER_ROLES_AND_POLICIES),
      },
      {
        id: CreateROSAWizardInternal.stepId.CLUSTER_UPDATES,
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.CLUSTER_UPDATES],
        component: (
          <ErrorBoundary>
            <UpdatesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.CLUSTER_UPDATES),
      },
      {
        id: CreateROSAWizardInternal.stepId.REVIEW_AND_CREATE,
        name: CreateROSAWizardInternal.stepNameById[
          CreateROSAWizardInternal.stepId.REVIEW_AND_CREATE],
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen
              isCreateClusterPending={createClusterResponse.pending}
              clusterRequestParams={{ isWizard: true }}
            />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(CreateROSAWizardInternal.stepId.REVIEW_AND_CREATE),
      },
    ];
    const ariaTitle = 'Create ROSA cluster wizard';

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
            {isErrorModalOpen && <CreateClusterErrorModal />}
            <PersistGate persistor={persistor}>
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
                footer={(!createClusterResponse.pending ? (
                  <CreateRosaWizardFooter
                    onSubmit={onSubmit}
                    onBeforeNext={this.onBeforeNext}
                    onBeforeSubmit={this.onBeforeSubmit}
                  />
                ) : <></>
                )}
              />
            </PersistGate>
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
      <LeaveCreateClusterPrompt />
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
