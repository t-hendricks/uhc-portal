import React from 'react';
import { Formik, FormikValues } from 'formik';
import omit from 'lodash/omit';
import { useDispatch } from 'react-redux';

import { Banner, PageSection, Wizard, WizardStep } from '@patternfly/react-core';

import { shouldRefetchQuota } from '~/common/helpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import {
  ClusterSettingsMachinePool,
  ClusterUpdates,
  NodeLabel,
} from '~/components/clusters/wizards/common';
import LeaveCreateClusterPrompt from '~/components/clusters/wizards/common/LeaveCreateClusterPrompt';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import PageTitle from '~/components/common/PageTitle';
import config from '~/config';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import { resetCreatedClusterResponse } from '~/redux/actions/clustersActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import { useGlobalState } from '~/redux/hooks';

import { AccountsAndRoles } from './AccountsAndRoles';
import { ClusterRolesAndPolicies } from './ClusterRolesAndPolicies';
import { breadcrumbs, FieldId, initialValues, StepId, StepName } from './constants';
import { ReviewAndCreate } from './ReviewAndCreate';

const CreateRosaWizardInternal = () => (
  <>
    <Wizard id="rosa-wizard" isVisitRequired>
      <WizardStep name={StepName.AccountsAndRoles} id={StepId.AccountsAndRoles}>
        <AccountsAndRoles />
      </WizardStep>
      <WizardStep
        name={StepName.ClusterSettings}
        id={StepId.ClusterSettings}
        steps={[
          <WizardStep name={StepName.Details} id={StepId.ClusterSettingsDetails}>
            Cluster settings details content (can share component with OSD)
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
            Networking - configuration content (can share component with OSD)
          </WizardStep>,
          <WizardStep name={StepName.VpcSettings} id={StepId.NetworkingVpcSettings}>
            Networking - VPC settings content (can share component with OSD)
          </WizardStep>,
          <WizardStep name={StepName.ClusterProxy} id={StepId.NetworkingClusterProxy}>
            Networking - Cluster proxy content (can share component with OSD)
          </WizardStep>,
          <WizardStep name={StepName.CidrRanges} id={StepId.NetworkingCidrRanges}>
            Networking - CIDR ranges content (can share component with OSD)
          </WizardStep>,
        ]}
      />
      <WizardStep name={StepName.ClusterRolesAndPolicies} id={StepId.ClusterRolesAndPolicies}>
        <ClusterRolesAndPolicies />
      </WizardStep>
      <WizardStep name={StepName.ClusterUpdates} id={StepId.ClusterUpdates}>
        <ClusterUpdates />
      </WizardStep>
      <WizardStep name={StepName.Review} id={StepId.Review}>
        <ReviewAndCreate />
      </WizardStep>
    </Wizard>
    <LeaveCreateClusterPrompt product={normalizedProducts.ROSA} />
  </>
);

export const CreateRosaWizard = () => {
  const dispatch = useDispatch();
  const organization = useGlobalState((state) => state.userProfile.organization);

  usePreventBrowserNav();

  React.useEffect(() => {
    if (shouldRefetchQuota(organization)) {
      dispatch(getOrganizationAndQuota() as any);
    }

    return () => {
      dispatch(resetCreatedClusterResponse());
    };
  }, [dispatch, organization]);

  const onSubmit = async (values: FormikValues) => {
    const hasNodeLabels = values[FieldId.NodeLabels].some(
      (nodeLabel: NodeLabel) => !!nodeLabel.key,
    );

    const submitValues = omit(values, [
      FieldId.CidrDefaultValuesEnabled,
      ...(!hasNodeLabels ? [FieldId.NodeLabels] : []),
    ]);

    // TODO, dispatch cluster creation request
    // eslint-disable-next-line no-console
    console.log(submitValues);
  };

  return (
    <Formik initialValues={initialValues} validateOnChange={false} onSubmit={onSubmit}>
      <>
        <PageTitle title="Create a ROSA Cluster" breadcrumbs={<Breadcrumbs path={breadcrumbs} />} />
        <PageSection>
          {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
            <Banner variant="gold">On submit, a fake ROSA cluster will be created.</Banner>
          )}
          <CreateRosaWizardInternal />
        </PageSection>
      </>
    </Formik>
  );
};
