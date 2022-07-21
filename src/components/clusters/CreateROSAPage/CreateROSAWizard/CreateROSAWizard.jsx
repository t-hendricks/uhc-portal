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
    if (currentStepId === 10 && !getUserRoleResponse?.fulfilled) {
      await this.getUserRoleInfo();
    }
    onNext();
  }

  // todo - move this to an external utility, to share among the wizards? where to?
  trackWizardNavigation = (eventKey, currentStepId = '') => {
    const { analytics } = this.props;
    // todo - figure out if that's ok as the path (considering we can't rely on the URL)
    const currentStepPath = `${window.location.pathname}/${currentStepId}`;
    const eventObj = getTrackEvent(
      eventKey,
      null,
      currentStepPath,
      ocmResourceType.MOA,
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
        id: 10,
        name: 'Accounts and roles',
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen organizationID={organization?.details?.id} />
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
            name: 'Details',
            component: (
              <ErrorBoundary>
                <ClusterSettingsScreen />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(21),
          },
          {
            id: 23,
            name: 'Machine pool',
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
        name: 'Networking',
        canJumpTo: this.canJumpTo(30),
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
                  showClusterWideProxyCheckbox
                  privateLinkSelected={privateLinkSelected}
                  forcePrivateLink
                />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(31),
          },
          installToVPCSelected && {
            id: 32,
            name: 'VPC settings',
            component: (
              <ErrorBoundary>
                <VPCScreen privateLinkSelected={privateLinkSelected} />
              </ErrorBoundary>
            ),
            canJumpTo: this.canJumpTo(32),
          },
          configureProxySelected && {
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
        name: 'Cluster roles and policies',
        component: (
          <ErrorBoundary>
            <ClusterRolesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(40),
      },
      {
        id: 50,
        name: 'Cluster updates',
        component: (
          <ErrorBoundary>
            <UpdatesScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(50),
      },
      {
        id: 60,
        name: 'Review and create',
        component: (
          <ErrorBoundary>
            <ReviewClusterScreen
              isCreateClusterPending={createClusterResponse.pending}
              clusterRequestParams={{ isWizard: true }}
            />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(60),
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
