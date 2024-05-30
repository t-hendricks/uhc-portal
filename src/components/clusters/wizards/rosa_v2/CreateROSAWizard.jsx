import React, { useMemo, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom-v5-compat';

import {
  Banner,
  PageSection,
  Wizard,
  WizardStep,
  WizardStepChangeScope,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import { ocmResourceType, trackEvents } from '~/common/analytics';
import { shouldRefetchQuota } from '~/common/helpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { AppDrawerContext } from '~/components/App/AppDrawer';
import { AppPage } from '~/components/App/AppPage';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { rosaWizardFormValidator } from '~/components/clusters/wizards/rosa_v2/formValidators';
import config from '~/config';
import withAnalytics from '~/hoc/withAnalytics';
import useAnalytics from '~/hooks/useAnalytics';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';
import { isRestrictedEnv } from '~/restrictedEnv';

import ErrorBoundary from '../../../App/ErrorBoundary';
import Breadcrumbs from '../../../common/Breadcrumbs';
import PageTitle from '../../../common/PageTitle';
import Unavailable from '../../../common/Unavailable';
import CreateClusterErrorModal from '../../common/CreateClusterErrorModal';
import LeaveCreateClusterPrompt from '../common/LeaveCreateClusterPrompt';

import CIDRScreen from './CIDRScreen/CIDRScreen';
import Details from './ClusterSettings/Details/Details';
import NetworkScreen from './NetworkScreen/NetworkScreen';
import UpdatesScreen from './UpdatesScreen/UpdatesScreen';
import VPCScreen from './VPCScreen/VPCScreen';
import AccountsRolesScreen from './AccountsRolesScreen';
import ClusterProxyScreen from './ClusterProxyScreen';
import ClusterRolesScreen from './ClusterRolesScreen';
import { FieldId, initialTouched, initialValues } from './constants';
import ControlPlaneScreen from './ControlPlaneScreen';
import CreateRosaWizardFooter from './CreateRosaWizardFooter';
import MachinePoolScreen from './MachinePoolScreen';
import ReviewClusterScreen from './ReviewClusterScreen';
import { stepId, stepNameById } from './rosaWizardConstants';
import { ROSAWizardContext } from './ROSAWizardContext';
import { ValuesPanel } from './ValuesPanel';

import './createROSAWizard.scss';

const breadcrumbs = [
  { label: 'Clusters' },
  { label: 'Cluster Type', path: '/create' },
  { label: 'Set up ROSA', path: '/create/rosa/getstarted' },
  { label: '[V2] Create a ROSA Cluster' },
];

const title = (
  <PageTitle title="[V2] Create a ROSA Cluster" breadcrumbs={<Breadcrumbs path={breadcrumbs} />} />
);

const trackWizardNavigation = (track, event, currentStepId = '') => {
  track(event, {
    resourceType: ocmResourceType.MOA,
    customProperties: {
      step_name: stepNameById[currentStepId],
    },
  });
};

const CreateROSAWizardInternal = ({
  isHypershiftEnabled,
  isHypershiftSelected,
  getOrganizationAndQuota,
  organization,
  machineTypes,
  cloudProviders,
  getMachineTypes,
  getCloudProviders,
  getInstallableVersionsResponse,
  clearInstallableVersions,
  getUserRoleResponse,
  createClusterResponse,
  getUserRole,
  privateLinkSelected,
  installToVPCSelected,
  configureProxySelected,
  resetResponse,
  closeDrawer,
  hasProductQuota,
  isErrorModalOpen,
  openModal,
  selectedAWSAccountID,
}) => {
  const navigate = useNavigate();
  const history = useHistory();
  const track = useAnalytics();
  const { resetForm, values } = useFormState();

  const accountAndRolesStepId = stepId.ACCOUNTS_AND_ROLES_AS_SECOND_STEP;
  const firstStepId = isHypershiftEnabled ? stepId.CONTROL_PLANE : accountAndRolesStepId;

  const [currentStepId, setCurrentStepId] = React.useState(firstStepId);
  const [currentStep, setCurrentStep] = React.useState();

  const stepsRef = React.useRef();
  const setStepRef = React.useRef();

  const onWizardContextChange = (steps, setStep) => {
    stepsRef.current = steps;
    setStepRef.current = setStep;
  };

  React.useEffect(() => {
    if (!currentStep) {
      return;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = currentStep.index; i < stepsRef.current.length; i++) {
      const nextStep = stepsRef.current[i];
      const isParentStep = nextStep.subStepIds !== undefined;
      if (!isParentStep && !nextStep.isHidden) {
        if (!nextStep.isVisited) {
          // can break out early if isVisited is not true for the remainder
          break;
        }
        // unvisit if step is past account roles step and has no assoc. aws acct. selected
        const noAssocAwsAcct = nextStep.id > accountAndRolesStepId && !selectedAWSAccountID;
        // unvisit if step is past the current step that has had a form change
        const afterChangedStep = nextStep.id > currentStepId;
        // TODO: Not all form changes should cause following steps to be unvisited
        setStepRef.current({
          ...nextStep,
          isVisited: !afterChangedStep && !noAssocAwsAcct,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  React.useEffect(() => {
    // On component mount
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
    return () => {
      // onUnmount
      resetResponse();
      resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }
  }, [createClusterResponse, isErrorModalOpen, openModal]);

  const ariaTitle = 'Create ROSA cluster wizard';
  const onClose = () => navigate('/create/cloud');

  const trackStepChange = (event, currentStepId = '') =>
    track(event, {
      resourceType: ocmResourceType.MOA,
      customProperties: {
        step_name: stepNameById[currentStepId],
      },
    });

  const onStepChange = (_event, currentStep, _prevStep, scope) => {
    setCurrentStep(currentStep);
    setCurrentStepId(currentStep.id);

    let trackEvent;

    switch (scope) {
      case WizardStepChangeScope.Next:
        trackEvent = trackEvents.WizardNext;
        break;
      case WizardStepChangeScope.Back:
        trackEvent = trackEvents.WizardBack;
        break;
      default:
        trackEvent = trackEvents.WizardLinkNav;
    }

    trackStepChange(trackEvent, currentStep.id);

    closeDrawer({ skipOnClose: true });
  };

  // RENDERING ////////////////
  // Not enough quota
  const orgWasFetched = !organization.pending && organization.fulfilled;
  if (orgWasFetched && !hasProductQuota) {
    return <Navigate replace to="/create" />;
  }

  // Needed data requests are pending
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

  // Any errors
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

  // Create cluster request has completed
  if (createClusterResponse.fulfilled) {
    // When a cluster is successfully created, unblock
    // history in order to not show a confirmation prompt.
    // TODO: Should be removed upon migrating to React Router v6
    history.block(() => {});
    return <Navigate replace to={`/details/s/${createClusterResponse.cluster.subscription?.id}`} />;
  }

  // Show wizard
  return (
    <>
      {title}
      <PageSection>
        {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
          <Banner variant="gold">On submit, a fake ROSA cluster will be created.</Banner>
        )}
        <div className="ocm-page pf-v5-u-display-flex">
          {isErrorModalOpen && <CreateClusterErrorModal />}
          <Wizard
            id="rosa-wizard"
            className="rosa-wizard pf-v5-u-flex-1"
            onClose={onClose}
            onStepChange={onStepChange}
            footer={
              <CreateRosaWizardFooter
                isHypershiftSelected={isHypershiftSelected}
                currentStepId={currentStepId}
                accountAndRolesStepId={accountAndRolesStepId}
                getUserRoleResponse={getUserRoleResponse}
                getUserRoleInfo={() => getUserRole()}
                isSubmitting={createClusterResponse.pending}
                onWizardContextChange={onWizardContextChange}
              />
            }
            nav={{ 'aria-label': `${ariaTitle} steps` }}
            isVisitRequired
          >
            {isHypershiftEnabled ? (
              <WizardStep id={stepId.CONTROL_PLANE} name={stepNameById[stepId.CONTROL_PLANE]}>
                <ErrorBoundary>
                  <ControlPlaneScreen />
                </ErrorBoundary>
              </WizardStep>
            ) : null}

            <WizardStep id={accountAndRolesStepId} name={stepNameById[accountAndRolesStepId]}>
              <ErrorBoundary>
                <AccountsRolesScreen
                  organizationID={organization?.details?.id}
                  isHypershiftEnabled={isHypershiftEnabled}
                  isHypershiftSelected={isHypershiftSelected}
                />
              </ErrorBoundary>
            </WizardStep>

            <WizardStep
              id={stepId.CLUSTER_SETTINGS}
              name={stepNameById[stepId.CLUSTER_SETTINGS]}
              isExpandable
              steps={[
                <WizardStep
                  id={stepId.CLUSTER_SETTINGS__DETAILS}
                  name={stepNameById[stepId.CLUSTER_SETTINGS__DETAILS]}
                >
                  <ErrorBoundary>
                    <Details />
                  </ErrorBoundary>
                </WizardStep>,

                <WizardStep
                  id={stepId.CLUSTER_SETTINGS__MACHINE_POOL}
                  name={stepNameById[stepId.CLUSTER_SETTINGS__MACHINE_POOL]}
                >
                  <ErrorBoundary>
                    <MachinePoolScreen />
                  </ErrorBoundary>
                </WizardStep>,
              ]}
            />

            <WizardStep
              id={stepId.NETWORKING}
              name={stepNameById[stepId.NETWORKING]}
              isExpandable
              steps={[
                <WizardStep
                  id={stepId.NETWORKING__CONFIGURATION}
                  name={stepNameById[stepId.NETWORKING__CONFIGURATION]}
                >
                  <ErrorBoundary>
                    <NetworkScreen
                      showClusterPrivacy
                      showVPCCheckbox
                      showClusterWideProxyCheckbox
                      privateLinkSelected={privateLinkSelected}
                      forcePrivateLink
                    />
                  </ErrorBoundary>
                </WizardStep>,

                <WizardStep
                  id={stepId.NETWORKING__VPC_SETTINGS}
                  name={stepNameById[stepId.NETWORKING__VPC_SETTINGS]}
                  isHidden={!installToVPCSelected || isHypershiftSelected}
                >
                  <ErrorBoundary>
                    <VPCScreen privateLinkSelected={privateLinkSelected} />
                  </ErrorBoundary>
                </WizardStep>,

                <WizardStep
                  id={stepId.NETWORKING__CLUSTER_WIDE_PROXY}
                  name={stepNameById[stepId.NETWORKING__CLUSTER_WIDE_PROXY]}
                  isHidden={!configureProxySelected}
                >
                  <ErrorBoundary>
                    <ClusterProxyScreen />
                  </ErrorBoundary>
                </WizardStep>,

                <WizardStep
                  id={stepId.NETWORKING__CIDR_RANGES}
                  name={stepNameById[stepId.NETWORKING__CIDR_RANGES]}
                >
                  <ErrorBoundary>
                    <CIDRScreen />
                  </ErrorBoundary>
                </WizardStep>,
              ]}
            />

            <WizardStep
              id={stepId.CLUSTER_ROLES_AND_POLICIES}
              name={stepNameById[stepId.CLUSTER_ROLES_AND_POLICIES]}
            >
              <ErrorBoundary>
                <ClusterRolesScreen />
              </ErrorBoundary>
            </WizardStep>

            <WizardStep id={stepId.CLUSTER_UPDATES} name={stepNameById[stepId.CLUSTER_UPDATES]}>
              <ErrorBoundary>
                <UpdatesScreen />
              </ErrorBoundary>
            </WizardStep>

            <WizardStep id={stepId.REVIEW_AND_CREATE} name={stepNameById[stepId.REVIEW_AND_CREATE]}>
              <ReviewClusterScreen isSubmitPending={createClusterResponse?.pending} />
            </WizardStep>
          </Wizard>
          {config.fakeOSD && <ValuesPanel />}
        </div>
      </PageSection>
    </>
  );
};

function CreateROSAWizard(props) {
  usePreventBrowserNav();
  const {
    values: {
      [FieldId.InstallToVpc]: installToVPCSelected,
      [FieldId.UsePrivateLink]: privateLinkSelected,
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
      validate={rosaWizardFormValidator}
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
