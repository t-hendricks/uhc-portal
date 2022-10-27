import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Formik, FormikValues, useFormikContext } from 'formik';

import { Banner, PageSection } from '@patternfly/react-core';
import { Wizard, WizardStep } from '@patternfly/react-core/dist/esm/next';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import config from '~/config';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import LeaveCreateClusterPrompt from '~/components/clusters/common/LeaveCreateClusterPrompt';
import submitOSDRequest from '~/components/clusters/CreateOSDPage/submitOSDRequest';

import { breadcrumbs, FieldId, initialValues, StepId, StepName, UrlPath } from './constants';
import { BillingModel } from './BillingModel';
import {
  ClusterSettingsCloudProvider,
  ClusterSettingsDetails,
  ClusterSettingsMachinePool,
} from './ClusterSettings';
import { NetworkingConfiguration, NetworkingCidrRanges } from './Networking';
import { ClusterUpdates } from './ClusterUpdates';
import { ReviewAndCreate } from './ReviewAndCreate';
import { CreateOsdWizardFooter } from './CreateOsdWizardFooter';

export const CreateOsdWizard: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  usePreventBrowserNav();

  const onSubmit = (values: FormikValues) => submitOSDRequest(dispatch, { isWizard: true })(values);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
  const dispatch = useDispatch();
  const history = useHistory();
  const { values } = useFormikContext<FormikValues>();
  const product = values[FieldId.Product];
  const userProfile = useGlobalState((state) => state.userProfile);
  const isLoading = userProfile.organization.pending;

  React.useEffect(() => {
    dispatch(getOrganizationAndQuota());
  }, []);

  const onClose = () => history.push(UrlPath.CreateCloud);

  if (isLoading) {
    return (
      <PageSection>
        <Spinner centered />
      </PageSection>
    );
  }

  return (
    <>
      <Wizard
        onClose={onClose}
        nav={{ forceStepVisit: true, isExpandable: true }}
        footer={<CreateOsdWizardFooter />}
      >
        <WizardStep name={StepName.BillingModel} id={StepId.BillingModel}>
          <BillingModel />
        </WizardStep>
        <WizardStep
          name={StepName.ClusterSettings}
          id={StepId.ClusterSettings}
          steps={[
            <WizardStep name={StepName.CloudProvider} id={StepId.ClusterSettingsCloudProvider}>
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
            <WizardStep name={StepName.CidrRanges} id={StepId.NetworkingCidrRanges}>
              <NetworkingCidrRanges />
            </WizardStep>,
          ]}
        />
        <WizardStep name={StepName.ClusterUpdates} id={StepId.ClusterUpdates}>
          <ClusterUpdates />
        </WizardStep>
        <WizardStep name={StepName.Review} id={StepId.Review}>
          <ReviewAndCreate />
        </WizardStep>
      </Wizard>
      <LeaveCreateClusterPrompt product={product} />
    </>
  );
};
