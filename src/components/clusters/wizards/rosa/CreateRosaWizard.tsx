import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, FormikValues } from 'formik';
import omit from 'lodash/omit';

import { Banner, PageSection } from '@patternfly/react-core';
import { Wizard, WizardStep } from '@patternfly/react-core/next';

import config from '~/config';
import { useGlobalState } from '~/redux/hooks';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import { resetCreatedClusterResponse } from '~/redux/actions/clustersActions';
import { shouldRefetchQuota } from '~/common/helpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import usePreventBrowserNav from '~/hooks/usePreventBrowserNav';
import LeaveCreateClusterPrompt from '~/components/clusters/common/LeaveCreateClusterPrompt';
import {
  ClusterUpdates,
  ClusterSettingsMachinePool,
  NodeLabel,
} from '~/components/clusters/wizards/common';
import { FieldId, StepName, StepId, initialValues, breadcrumbs } from './constants';
import { ReviewAndCreate } from './ReviewAndCreate';
import { AccountsAndRoles } from './AccountsAndRoles';
import { ClusterRolesAndPolicies } from './ClusterRolesAndPolicies';

export const CreateRosaWizard = () => {
  const dispatch = useDispatch();
  const organization = useGlobalState((state) => state.userProfile.organization);

  usePreventBrowserNav();

  React.useEffect(() => {
    if (shouldRefetchQuota(organization)) {
      dispatch(getOrganizationAndQuota());
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
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <>
        <PageTitle title="Create a ROSA Cluster" breadcrumbs={<Breadcrumbs path={breadcrumbs} />} />
        <PageSection>
          {config.fakeOSD && ( // TODO Is ?fake=true supported for ROSA clusters?
            <Banner variant="warning">On submit, a fake ROSA cluster will be created.</Banner>
          )}
          <CreateRosaWizardInternal />
        </PageSection>
      </>
    </Formik>
  );
};

const CreateRosaWizardInternal = () => (
  <>
    <Wizard id="rosa-wizard" isVisitRequired>
      <WizardStep name={StepName.AccountsAndRoles} id={StepId.AccountsAndRoles}>
        <AccountsAndRoles />
      </WizardStep>
      <WizardStep
        name={StepName.ClusterSettings}
        id={StepId.ClusterSettings}
        isExpandable
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
        isExpandable
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
