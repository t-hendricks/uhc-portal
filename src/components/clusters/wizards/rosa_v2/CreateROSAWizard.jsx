import { Spinner } from '@redhat-cloud-services/frontend-components';
import { isMatch } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom-v5-compat';
import { Banner, Bullseye, PageSection, Stack, StackItem } from '@patternfly/react-core';
import {
  Wizard as WizardDeprecated,
  WizardContext as WizardContextDeprecated,
} from '@patternfly/react-core/deprecated';
import { Formik } from 'formik';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { ocmResourceType, trackEvents } from '~/common/analytics';
import { shouldRefetchQuota } from '~/common/helpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import config from '~/config';
import withAnalytics from '~/hoc/withAnalytics';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';
import { AppPage } from '~/components/App/AppPage';
import { AppDrawerContext } from '~/components/App/AppDrawer';
import { isRestrictedEnv } from '~/restrictedEnv';
import { getAccountAndRolesStepId, stepId, stepNameById } from './rosaWizardConstants';
import { initialValues, initialTouched, FieldId } from './constants';

import CIDRScreen from './CIDRScreen/CIDRScreen';
import ClusterProxyScreen from './ClusterProxyScreen';
import ClusterSettingsScreen from './ClusterSettingsScreen';
import MachinePoolScreen from './MachinePoolScreen';
import NetworkScreen from './NetworkScreen/NetworkScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import UpdatesScreen from './UpdatesScreen';
import VPCScreen from './VPCScreen/VPCScreen';
import ControlPlaneScreen from './ControlPlaneScreen';

import ErrorBoundary from '../../../App/ErrorBoundary';
import Breadcrumbs from '../../../common/Breadcrumbs';
import PageTitle from '../../../common/PageTitle';
import Unavailable from '../../../common/Unavailable';
import CreateClusterErrorModal from '../../common/CreateClusterErrorModal';
import LeaveCreateClusterPrompt from '../common/LeaveCreateClusterPrompt';
import AccountsRolesScreen from './AccountsRolesScreen';
import ClusterRolesScreen from './ClusterRolesScreen';
import { ROSAWizardContext } from './ROSAWizardContext';
import { ValuesPanel } from './ValuesPanel';

import CreateRosaWizardFooter from './CreateRosaWizardFooter';

import './createROSAWizard.scss';

const trackWizardNavigation = (track, event, currentStepId = '') => {
  track(event, {
    resourceType: ocmResourceType.MOA,
    customProperties: {
      step_name: stepNameById[currentStepId],
    },
  });
};

class CreateROSAWizardInternal extends React.Component {
  state = {
    stepIdReached: undefined,
    currentStepId: undefined,
    accountAndRolesStepId: undefined,
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
      isHypershiftEnabled,
      getInstallableVersionsResponse,
      clearInstallableVersions,
    } = this.props;

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    if (getInstallableVersionsResponse.fulfilled) {
      clearInstallableVersions();
    }

    const firstStepId = isHypershiftEnabled
      ? stepId.CONTROL_PLANE
      : stepId.ACCOUNTS_AND_ROLES_AS_FIRST_STEP;
    this.setState({
      stepIdReached: firstStepId,
      currentStepId: firstStepId,
      accountAndRolesStepId: getAccountAndRolesStepId(isHypershiftEnabled),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      createClusterResponse,
      isErrorModalOpen,
      openModal,
      formValues,
      isValid,
      isValidating,
      installToVPCSelected,
      configureProxySelected,
    } = this.props;
    const { currentStepId } = this.state;

    // Track validity of individual steps by id
    if (isValid !== prevProps.isValid && !isValidating) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({
        validatedSteps: {
          ...prevState.validatedSteps,
          // reset steps that were removed from the wizard due to a toggle on another step
          ...(installToVPCSelected ? { [stepId.NETWORKING__VPC_SETTINGS]: undefined } : {}),
          ...(configureProxySelected ? { [stepId.NETWORKING__CLUSTER_WIDE_PROXY]: undefined } : {}),
          // update the current step (overriding the possible assignments above)
          [currentStepId]: isValid,
        },
      }));
    }

    const formValuesChanged = !isMatch(prevProps.formValues, formValues);
    if (formValuesChanged) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ stepIdReached: currentStepId });
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

  // triggered by all forms of navigation;
  // next / back / nav-links / imperative (e.g. "edit step" links in the review step)
  onCurrentStepChanged = ({ id }) => {
    const { closeDrawer } = this.props;
    this.setState({ currentStepId: id });
    closeDrawer({ skipOnClose: true });
  };

  onNext = ({ id }, { prevId }) => {
    const { track } = this.props;
    const { stepIdReached } = this.state;
    if (id && stepIdReached < id) {
      this.setState({ stepIdReached: id });
    }
    trackWizardNavigation(track, trackEvents.WizardNext, prevId);
  };

  // only triggered by the wizard nav-links
  onGoToStep = ({ id }) => {
    const { track } = this.props;
    trackWizardNavigation(track, trackEvents.WizardLinkNav, id);
  };

  onBack = ({ id }) => {
    const { track } = this.props;
    trackWizardNavigation(track, trackEvents.WizardBack, id);
  };

  canJumpTo = (id) => {
    if (config.fakeOSD) {
      return true;
    }
    const { stepIdReached, currentStepId, accountAndRolesStepId, validatedSteps } = this.state;
    const { selectedAWSAccountID } = this.props;

    const hasPrevStepError = Object.entries(validatedSteps).some(
      ([validatedStepId, isStepValid]) => isStepValid === false && validatedStepId < id,
    );

    // disable all future wizard step links if no assoc. aws acct. selected
    if (id > accountAndRolesStepId && !selectedAWSAccountID) {
      return false;
    }

    // Allow step navigation forward when the current step is valid and backwards regardless.
    return id <= currentStepId || (id <= stepIdReached && !hasPrevStepError);
  };

  getUserRoleInfo = () => {
    const { getUserRole } = this.props;
    return getUserRole();
  };

  render() {
    const {
      installToVPCSelected,
      createClusterResponse,
      machineTypes,
      organization,
      isErrorModalOpen,
      hasProductQuota,
      history,
      privateLinkSelected,
      configureProxySelected,
      isHypershiftEnabled,
      isHypershiftSelected,
      getUserRoleResponse,
    } = this.props;
    const { accountAndRolesStepId, currentStepId } = this.state;

    const steps = [
      isHypershiftEnabled && {
        id: stepId.CONTROL_PLANE,
        name: stepNameById[stepId.CONTROL_PLANE],
        component: (
          <ErrorBoundary>
            <ControlPlaneScreen />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.CONTROL_PLANE),
      },
      {
        id: accountAndRolesStepId,
        name: stepNameById[accountAndRolesStepId],
        component: (
          <ErrorBoundary>
            <AccountsRolesScreen
              organizationID={organization?.details?.id}
              isHypershiftEnabled={isHypershiftEnabled}
              isHypershiftSelected={isHypershiftSelected}
            />
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(accountAndRolesStepId),
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
          installToVPCSelected &&
            !isHypershiftSelected && {
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
                <CIDRScreen isROSA />
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
            <WizardContextDeprecated.Consumer>
              {({ goToStepById }) =>
                !createClusterResponse.pending ? (
                  <ReviewClusterScreen goToStepById={goToStepById} />
                ) : (
                  <Bullseye>
                    <Stack>
                      <StackItem>
                        <Bullseye>
                          <Spinner size="xl" isSVG />
                        </Bullseye>
                      </StackItem>
                      <StackItem>
                        <Bullseye>
                          Creating your cluster. Do not refresh this page. This request may take a
                          moment...
                        </Bullseye>
                      </StackItem>
                    </Stack>
                  </Bullseye>
                )
              }
            </WizardContextDeprecated.Consumer>
          </ErrorBoundary>
        ),
        canJumpTo: this.canJumpTo(stepId.REVIEW_AND_CREATE),
      },
    ].filter(Boolean);

    const ariaTitle = 'Create ROSA cluster wizard';

    const orgWasFetched = !organization.pending && organization.fulfilled;

    if (createClusterResponse.fulfilled) {
      // When a cluster is successfully created,
      // unblock history in order to not show a confirmation prompt.
      history.block(() => {});

      return (
        <Navigate replace to={`/details/s/${createClusterResponse.cluster.subscription.id}`} />
      );
    }

    if (orgWasFetched && !hasProductQuota) {
      return <Navigate replace to="/create" />;
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
      { label: 'Set up ROSA', path: '/create/rosa/getstarted' },
      { label: '[V2] Create a ROSA Cluster' },
    ];

    const title = (
      <PageTitle
        title="[V2] Create a ROSA Cluster"
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
      );
    }

    return (
      <>
        {title}
        <PageSection>
          {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
            <Banner variant="gold">On submit, a fake ROSA cluster will be created.</Banner>
          )}
          <div className="ocm-page pf-v5-u-display-flex">
            {isErrorModalOpen && <CreateClusterErrorModal />}
            <WizardDeprecated
              className="rosa-wizard pf-v5-u-flex-1"
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
              isNavExpandable
              onNext={this.onNext}
              onBack={this.onBack}
              onGoToStep={this.onGoToStep}
              onCurrentStepChanged={this.onCurrentStepChanged}
              onClose={() => history.push('/')}
              footer={
                !createClusterResponse.pending ? (
                  <CreateRosaWizardFooter
                    firstStepId={steps[0].id}
                    isHypershiftSelected={isHypershiftSelected}
                    currentStepId={currentStepId}
                    accountAndRolesStepId={accountAndRolesStepId}
                    getUserRoleResponse={getUserRoleResponse}
                    getUserRoleInfo={this.getUserRoleInfo}
                  />
                ) : null
              }
            />
            {config.fakeOSD && <ValuesPanel />}
          </div>
        </PageSection>
      </>
    );
  }
}

function CreateROSAWizard(props) {
  usePreventBrowserNav();
  const {
    values: {
      [FieldId.InstallToVpc]: installToVPCSelected,
      [FieldId.UsePrivatelink]: privateLinkSelected,
      [FieldId.ConfigureProxy]: configureProxySelected,
      [FieldId.AssociatedAwsId]: selectedAWSAccountID,
      [FieldId.Hypershift]: hypershiftValue,
    },
    values,
    isValidating,
    isValid,
    resetForm,
  } = useFormState();
  const isHypershiftSelected = hypershiftValue === 'true';
  const combinedProps = {
    ...props,
    installToVPCSelected,
    privateLinkSelected,
    configureProxySelected,
    selectedAWSAccountID,
    isHypershiftSelected,
  };
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE) && !isRestrictedEnv();
  const [forceLeaveWizard, setForceLeaveWizard] = useState(false);
  const contextValue = useMemo(
    () => ({ forceLeaveWizard, setForceLeaveWizard }),
    [forceLeaveWizard, setForceLeaveWizard],
  );
  return (
    <ROSAWizardContext.Provider value={contextValue}>
      <AppPage title="Create OpenShift ROSA Cluster">
        <AppDrawerContext.Consumer>
          {({ closeDrawer }) => (
            <CreateROSAWizardInternal
              {...combinedProps}
              closeDrawer={closeDrawer}
              isHypershiftEnabled={isHypershiftEnabled}
              formValues={values}
              isValidating={isValidating}
              isValid={isValid}
              resetForm={resetForm}
            />
          )}
        </AppDrawerContext.Consumer>
        <LeaveCreateClusterPrompt
          product={normalizedProducts.ROSA}
          forceLeaveWizard={forceLeaveWizard}
        />
      </AppPage>
    </ROSAWizardContext.Provider>
  );
}

const requestStatePropTypes = PropTypes.shape({
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  pending: PropTypes.bool,
});

CreateROSAWizardInternal.propTypes = {
  // formik props
  isValidating: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,

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
  openModal: PropTypes.func,
  getUserRoleResponse: PropTypes.object,
  selectedAWSAccountID: PropTypes.string,
  formValues: PropTypes.object,

  // for "no quota" redirect
  hasProductQuota: PropTypes.bool,

  // for cancel button
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func,
  }).isRequired,

  closeDrawer: PropTypes.func,
};

const CreateROSAWizardFormik = (props) => {
  const { onSubmit, track } = props;
  return (
    <Formik
      initialValues={initialValues}
      initialTouched={initialTouched}
      validateOnChange
      onSubmit={(formikValues) => {
        trackWizardNavigation(track, trackEvents.WizardSubmit);
        onSubmit(formikValues);
      }}
    >
      <CreateROSAWizard {...props} />
    </Formik>
  );
};

CreateROSAWizardFormik.propTypes = { ...CreateROSAWizardInternal.propTypes };

export default withAnalytics(CreateROSAWizardFormik);
