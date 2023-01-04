import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import { Formik, FormikValues } from 'formik';
import omit from 'lodash/omit';

import { Banner, PageSection } from '@patternfly/react-core';
import { Wizard, WizardNavStepData, WizardStep } from '@patternfly/react-core/dist/esm/next';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import config from '~/config';
import { ErrorState } from '~/types/types';
import useAnalytics from '~/hooks/useAnalytics';
import { shouldRefetchQuota } from '~/common/helpers';
import getLoadBalancerValues from '~/redux/actions/loadBalancerActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import getPersistentStorageValues from '~/redux/actions/persistentStorageActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { resetCreatedClusterResponse } from '~/redux/actions/clustersActions';
import { ocmResourceTypeByProduct, trackEvents, TrackEvent } from '~/common/analytics';
import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import LeaveCreateClusterPrompt from '~/components/clusters/common/LeaveCreateClusterPrompt';
import submitOSDRequest from '~/components/clusters/CreateOSDPage/submitOSDRequest';
import Unavailable from '../common/Unavailable';
import { availableClustersFromQuota } from '../clusters/common/quotaSelectors';
import {
  ariaLabel,
  breadcrumbs,
  documentTitle,
  FieldId,
  initialTouched,
  initialValues,
  StepId,
  StepName,
  UrlPath,
} from './constants';
import { useFormState } from './hooks';
import { BillingModel } from './BillingModel';
import {
  ClusterSettingsCloudProvider,
  ClusterSettingsDetails,
  ClusterSettingsMachinePool,
  CloudProviderStepFooter,
  NodeLabel,
} from './ClusterSettings';
import {
  NetworkingConfiguration,
  NetworkingCidrRanges,
  NetworkingVpcSettings,
  NetworkingClusterProxy,
} from './Networking';
import { ClusterUpdates } from './ClusterUpdates';
import { ReviewAndCreate } from './ReviewAndCreate';
import { CreateOsdWizardFooter } from './CreateOsdWizardFooter';

export const CreateOsdWizard = () => {
  const dispatch = useDispatch();
  const persistentStorageValues = useGlobalState((state) => state.persistentStorageValues);
  const loadBalancerValues = useGlobalState((state) => state.loadBalancerValues);
  const organization = useGlobalState((state) => state.userProfile.organization);

  usePreventBrowserNav();

  React.useEffect(() => {
    if (shouldRefetchQuota(organization)) {
      dispatch(getOrganizationAndQuota());
    }
    if (!persistentStorageValues.fulfilled && !persistentStorageValues.pending) {
      dispatch(getPersistentStorageValues());
    }
    if (!loadBalancerValues.fulfilled && !loadBalancerValues.pending) {
      dispatch(getLoadBalancerValues());
    }
    return () => {
      dispatch(resetCreatedClusterResponse());
    };
  }, [
    dispatch,
    loadBalancerValues.fulfilled,
    loadBalancerValues.pending,
    organization,
    persistentStorageValues.fulfilled,
    persistentStorageValues.pending,
  ]);

  const onSubmit = async (values: FormikValues) => {
    const hasNodeLabels = values[FieldId.NodeLabels].some(
      (nodeLabel: NodeLabel) => !!nodeLabel.key,
    );
    const submitValues = omit(values, [
      FieldId.CidrDefaultValuesEnabled,
      FieldId.AcknowledgePrereq,
      ...(!hasNodeLabels ? [FieldId.NodeLabels] : []),
    ]);
    dispatch(() => submitOSDRequest(dispatch, { isWizard: true })(submitValues));
  };

  return (
    <Formik initialValues={initialValues} initialTouched={initialTouched} onSubmit={onSubmit}>
      <>
        <PageTitle
          title="Create an OpenShift Dedicated Cluster"
          breadcrumbs={<Breadcrumbs path={breadcrumbs} />}
        />
        <PageSection>
          {config.fakeOSD && (
            <Banner variant="warning">On submit, a fake OSD cluster will be created.</Banner>
          )}
          <CreateOsdWizardInternal />
        </PageSection>
      </>
    </Formik>
  );
};

const CreateOsdWizardInternal = () => {
  const track = useAnalytics();
  const history = useHistory();
  const { values } = useFormState();
  const product = values[FieldId.Product];
  const organization = useGlobalState((state) => state.userProfile.organization);
  const loadBalancerValues = useGlobalState((state) => state.loadBalancerValues);
  const persistentStorageValues = useGlobalState((state) => state.persistentStorageValues);
  const createClusterResponse = useGlobalState((state) => state.clusters.createdCluster);

  const hasProductQuota =
    availableClustersFromQuota(organization.quotaList, {
      product,
    }) >= 1;

  const requestErrors = [
    {
      data: organization,
      name: 'Organization & Quota',
    },
    {
      data: loadBalancerValues,
      name: 'Load balancers',
    },
    {
      data: persistentStorageValues,
      name: 'Storage options',
    },
  ].reduce((acc: { key: string; message: string; response: ErrorState }[], request) => {
    if (request.data.error) {
      acc.push({
        key: request.name,
        message: `Error while loading required form data (${request.name})`,
        response: request.data,
      });
    }
    return acc;
  }, []);

  const trackStepChange = (event: TrackEvent, stepName?: string) =>
    track(event, {
      resourceType: (ocmResourceTypeByProduct as Record<string, string>)[product],
      ...(stepName && {
        customProperties: {
          step_name: stepName,
        },
      }),
    });

  const onClose = () => history.push(UrlPath.CreateCloud);
  const onNext = ({ name }: WizardNavStepData) => trackStepChange(trackEvents.WizardNext, name);
  const onBack = ({ name }: WizardNavStepData) => trackStepChange(trackEvents.WizardBack, name);
  const onNavByIndex = ({ name }: WizardNavStepData) =>
    trackStepChange(trackEvents.WizardLinkNav, name);

  if (
    organization.pending ||
    loadBalancerValues.pending ||
    persistentStorageValues.pending ||
    (!organization.fulfilled && !organization.error)
  ) {
    return (
      <PageSection>
        <Spinner centered />
      </PageSection>
    );
  }

  if (createClusterResponse.fulfilled) {
    // When a cluster is successfully created, unblock
    // history in order to not show a confirmation prompt.
    history.block(() => {});
    return <Redirect to={`/details/s/${createClusterResponse.cluster.subscription?.id}`} />;
  }

  if (organization.fulfilled && !hasProductQuota) {
    return <Redirect to="/create" />;
  }

  if (requestErrors.length > 0) {
    return (
      <PageSection>
        <Unavailable errors={requestErrors} />
      </PageSection>
    );
  }

  return (
    <>
      <Wizard
        onClose={onClose}
        onNext={onNext}
        onBack={onBack}
        onNavByIndex={onNavByIndex}
        footer={<CreateOsdWizardFooter />}
        nav={{ 'aria-label': `${ariaLabel} steps` }}
        isStepVisitRequired
      >
        <WizardStep name={StepName.BillingModel} id={StepId.BillingModel}>
          <BillingModel />
        </WizardStep>
        <WizardStep
          name={StepName.ClusterSettings}
          id={StepId.ClusterSettings}
          steps={[
            <WizardStep
              name={StepName.CloudProvider}
              id={StepId.ClusterSettingsCloudProvider}
              footer={<CloudProviderStepFooter />}
            >
              <ClusterSettingsCloudProvider />
            </WizardStep>,
            <WizardStep name={StepName.Details} id={StepId.ClusterSettingsDetails}>
              <ClusterSettingsDetails />
            </WizardStep>,
            <WizardStep name={StepName.MachinePool} id={StepId.ClusterSettingsMachinePool}>
              <ClusterSettingsMachinePool />
            </WizardStep>,
          ]}
        />
        <WizardStep
          name={StepName.Networking}
          id={StepId.Networking}
          steps={[
            <WizardStep name={StepName.Configuration} id={StepId.NetworkingConfiguration}>
              <NetworkingConfiguration />
            </WizardStep>,
            <WizardStep
              name={StepName.VpcSettings}
              id={StepId.NetworkingVpcSettings}
              isHidden={!values[FieldId.InstallToVpc]}
            >
              <NetworkingVpcSettings />
            </WizardStep>,
            <WizardStep
              name={StepName.ClusterProxy}
              id={StepId.NetworkingClusterProxy}
              isHidden={!values[FieldId.ConfigureProxy]}
            >
              <NetworkingClusterProxy />
            </WizardStep>,
            <WizardStep name={StepName.CidrRanges} id={StepId.NetworkingCidrRanges}>
              <NetworkingCidrRanges />
            </WizardStep>,
          ]}
        />
        <WizardStep name={StepName.ClusterUpdates} id={StepId.ClusterUpdates}>
          <ClusterUpdates />
        </WizardStep>
        <WizardStep name={StepName.Review} id={StepId.Review}>
          <ReviewAndCreate track={() => trackStepChange(trackEvents.WizardSubmit)} />
        </WizardStep>
      </Wizard>
      <LeaveCreateClusterPrompt product={product} />
    </>
  );
};

document.title = documentTitle;
