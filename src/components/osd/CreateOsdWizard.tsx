import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Formik, FormikValues, useFormikContext } from 'formik';

import { Banner, PageSection } from '@patternfly/react-core';
import { Wizard, WizardStep } from '@patternfly/react-core/dist/esm/next';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import config from '~/config';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import { breadcrumbs, FieldId, initialValues, StepId, StepName, UrlPath } from './constants';
import { BillingModel } from './BillingModel';
import { ReviewAndCreate } from './ReviewAndCreate';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import LeaveCreateClusterPrompt from '../clusters/common/LeaveCreateClusterPrompt';
import submitOSDRequest from '../clusters/CreateOSDPage/submitOSDRequest';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';

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
      <Wizard onClose={onClose} nav={{ forceStepVisit: true, isExpandable: true }}>
        <WizardStep name={StepName.BillingModel} id={StepId.BillingModel}>
          <BillingModel />
        </WizardStep>
        <WizardStep name={StepName.Review} id={StepId.Review}>
          <ReviewAndCreate />
        </WizardStep>
      </Wizard>
      <LeaveCreateClusterPrompt product={product} />
    </>
  );
};
