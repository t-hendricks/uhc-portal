import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Title, Bullseye, Stack, StackItem, Spinner } from '@patternfly/react-core';

import config from '~/config';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { getUserRoleForSelectedAWSAccount } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/AccountsRolesScreen/AccountsRolesScreen';
import {
  stepId,
  stepNameById,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/osdWizardConstants';
import {
  stepId as rosaStepId,
  stepNameById as rosaStepNameById,
} from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaWizardConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';

import ReduxHiddenCheckbox from '~/components/common/ReduxFormComponents/ReduxHiddenCheckbox';
import DebugClusterRequest from '~/components/clusters/CreateOSDPage/DebugClusterRequest';
import ReviewSection, { ReviewItem, ReviewRoleItem } from './ReviewSection';

import './ReviewClusterScreen.scss';

const ReviewClusterScreen = ({
  change,
  clusterRequestParams,
  formValues,
  canAutoScale,
  autoscalingEnabled,
  isCreateClusterPending,
  installToVPCSelected,
  configureProxySelected,
  getUserRole,
  getOCMRole,
  getUserRoleResponse,
  getOCMRoleResponse,
  clearGetUserRoleResponse,
  clearGetOcmRoleResponse,
  goToStepById,
  isHypershiftSelected,
}) => {
  const isByoc = formValues.byoc === 'true';
  const isAWS = formValues.cloud_provider === 'aws';
  const isGCP = formValues.cloud_provider === 'gcp';
  const isROSA = formValues.product === normalizedProducts.ROSA;
  const hasEtcdEncryption = isHypershiftSelected && !!formValues.etcd_key_arn;
  const showVPCCheckbox = isROSA || isByoc;
  const clusterSettingsFields = [
    ...(!isROSA ? ['cloud_provider'] : []),
    'name',
    'cluster_version',
    'region',
    'multi_az',
    ...(!isByoc && !isROSA ? ['persistent_storage'] : []),
    ...(!isByoc && isROSA ? ['load_balancers'] : []),
    ...(isByoc && isAWS && !isROSA ? ['disable_scp_checks'] : []),
    ...(!isHypershiftSelected ? ['enable_user_workload_monitoring'] : []),
    ...(isByoc ? ['customer_managed_key'] : []),
    'etcd_encryption',
    ...(hasEtcdEncryption ? ['etcd_key_arn'] : []),
  ];

  if (isCreateClusterPending) {
    return (
      <Bullseye>
        <Stack>
          <StackItem>
            <Bullseye>
              <Spinner size="xl" isSVG />
            </Bullseye>
          </StackItem>
          <StackItem>
            <Bullseye>
              Creating your cluster. Do not refresh this page. This request may take a moment...
            </Bullseye>
          </StackItem>
        </Stack>
      </Bullseye>
    );
  }

  const [userRole, setUserRole] = useState('');
  const [ocmRole, setOcmRole] = useState('');
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);

  useEffect(() => {
    clearGetUserRoleResponse();
    clearGetOcmRoleResponse();
    // reset hidden form field to false
    change('detected_ocm_and_user_roles', false);
  }, []);

  useEffect(() => {
    if (!isROSA) {
      return;
    }
    if (getUserRoleResponse.fulfilled) {
      const userRoleForAWSAccount = getUserRoleForSelectedAWSAccount(
        getUserRoleResponse.data,
        formValues.associated_aws_id,
      );
      setUserRole(userRoleForAWSAccount?.sts_user);
    }
    if (
      !getUserRoleResponse.fulfilled &&
      !getUserRoleResponse.pending &&
      !getUserRoleResponse.error
    ) {
      getUserRole();
    }
  }, [getUserRoleResponse]);

  useEffect(() => {
    if (!isROSA) {
      return;
    }
    if (getOCMRoleResponse.fulfilled) {
      setOcmRole(getOCMRoleResponse.data?.arn);
    }
    if (!getOCMRoleResponse.fulfilled && !getOCMRoleResponse.pending && !getOCMRoleResponse.error) {
      getOCMRole(formValues.associated_aws_id);
    }
  }, [getOCMRoleResponse]);

  const errorWithAWSAccountRoles =
    getUserRoleResponse?.error || !userRole || getOCMRoleResponse?.error || !ocmRole;
  // setting hidden form field for field level validation
  change('detected_ocm_and_user_roles', !errorWithAWSAccountRoles);

  const getStepId = (stepKey) => {
    let step = stepKey;
    if (stepKey === 'CLUSTER_SETTINGS') {
      // choose a different sub-step for ROSA and OSD
      if (isROSA) {
        step = 'CLUSTER_SETTINGS__DETAILS';
      } else {
        step = 'CLUSTER_SETTINGS__CLOUD_PROVIDER';
      }
    }
    return isROSA ? rosaStepId[step] : stepId[step];
  };

  const getStepName = (stepKey) =>
    isROSA ? rosaStepNameById[rosaStepId[stepKey]] : stepNameById[stepId[stepKey]];

  let accountStepId = 'ACCOUNTS_AND_ROLES';
  if (isROSA) {
    accountStepId = isHypershiftEnabled
      ? 'ACCOUNTS_AND_ROLES_AS_SECOND_STEP'
      : 'ACCOUNTS_AND_ROLES_AS_FIRST_STEP';
  }

  return (
    <div className="ocm-create-osd-review-screen">
      <Title headingLevel="h2" className="pf-u-pb-md">
        Review your {isROSA ? 'ROSA' : 'dedicated'} cluster
      </Title>
      {isROSA && (
        <>
          <ReduxHiddenCheckbox name="detected_ocm_and_user_roles" />
          {isHypershiftEnabled && (
            <ReviewSection
              title={getStepName('CONTROL_PLANE')}
              onGoToStep={() => goToStepById(getStepId('CONTROL_PLANE'))}
            >
              {ReviewItem({ name: 'hypershift', formValues })}
            </ReviewSection>
          )}
          <ReviewSection
            title={getStepName(accountStepId)}
            onGoToStep={() => goToStepById(getStepId(accountStepId))}
            initiallyExpanded={errorWithAWSAccountRoles}
          >
            {ReviewItem({ name: 'associated_aws_id', formValues })}
            {ReviewRoleItem({
              name: 'ocm-role',
              getRoleResponse: getOCMRoleResponse,
              content: ocmRole,
            })}
            {ReviewRoleItem({
              name: 'user-role',
              getRoleResponse: getUserRoleResponse,
              content: userRole,
            })}
            {ReviewItem({ name: 'installer_role_arn', formValues })}
            {ReviewItem({ name: 'support_role_arn', formValues })}
            {!isHypershiftSelected && ReviewItem({ name: 'control_plane_role_arn', formValues })}
            {ReviewItem({ name: 'worker_role_arn', formValues })}
          </ReviewSection>
        </>
      )}
      {!isROSA && (
        <ReviewSection
          title={getStepName('BILLING_MODEL')}
          onGoToStep={() => goToStepById(getStepId('BILLING_MODEL'))}
        >
          {ReviewItem({ name: 'billing_model', formValues })}
          {ReviewItem({ name: 'byoc', formValues })}
        </ReviewSection>
      )}
      <ReviewSection
        title={getStepName('CLUSTER_SETTINGS')}
        onGoToStep={() => goToStepById(getStepId('CLUSTER_SETTINGS'))}
      >
        {clusterSettingsFields.map((name) => ReviewItem({ name, formValues }))}
      </ReviewSection>
      <ReviewSection
        title="Default machine pool"
        onGoToStep={() => goToStepById(getStepId('CLUSTER_SETTINGS__MACHINE_POOL'))}
      >
        {ReviewItem({ name: 'machine_type', formValues })}
        {canAutoScale && ReviewItem({ name: 'autoscalingEnabled', formValues })}
        {autoscalingEnabled
          ? ReviewItem({ name: 'min_replicas', formValues })
          : ReviewItem({ name: 'nodes_compute', formValues })}
        {!(formValues.node_labels.length === 1 && isEmpty(formValues.node_labels[0])) &&
          ReviewItem({ name: 'node_labels', formValues })}
      </ReviewSection>
      <ReviewSection
        title={getStepName('NETWORKING')}
        onGoToStep={() =>
          goToStepById(getStepId(`NETWORKING__${isAWS ? 'CONFIGURATION' : 'CIDR_RANGES'}`))
        }
      >
        {ReviewItem({ name: 'cluster_privacy', formValues })}
        {showVPCCheckbox && ReviewItem({ name: 'install_to_vpc', formValues })}
        {showVPCCheckbox &&
          (formValues.hypershift === 'true' ||
            (formValues.cluster_privacy === 'internal' && formValues.install_to_vpc)) &&
          ReviewItem({ name: 'use_privatelink', formValues })}
        {showVPCCheckbox &&
          formValues.install_to_vpc &&
          isAWS &&
          ReviewItem({ name: 'aws_vpc', formValues })}
        {showVPCCheckbox &&
          formValues.install_to_vpc &&
          isGCP &&
          ReviewItem({ name: 'gpc_vpc', formValues })}
        {installToVPCSelected && ReviewItem({ name: 'configure_proxy', formValues })}
        {installToVPCSelected &&
          configureProxySelected &&
          ReviewItem({ name: 'http_proxy_url', formValues })}
        {installToVPCSelected &&
          configureProxySelected &&
          ReviewItem({ name: 'https_proxy_url', formValues })}
        {installToVPCSelected &&
          configureProxySelected &&
          ReviewItem({ name: 'no_proxy_domains', formValues })}
        {installToVPCSelected &&
          configureProxySelected &&
          ReviewItem({ name: 'additional_trust_bundle', formValues })}
        {ReviewItem({ name: 'network_machine_cidr', formValues })}
        {ReviewItem({ name: 'network_service_cidr', formValues })}
        {ReviewItem({ name: 'network_pod_cidr', formValues })}
        {ReviewItem({ name: 'network_host_prefix', formValues })}
      </ReviewSection>
      {isROSA && (
        <ReviewSection
          title={getStepName('CLUSTER_ROLES_AND_POLICIES')}
          onGoToStep={() => goToStepById(getStepId('CLUSTER_ROLES_AND_POLICIES'))}
        >
          {!isHypershiftSelected &&
            ReviewItem({ name: 'rosa_roles_provider_creation_mode', formValues })}
          {formValues.byo_oidc_config_id && (
            <>
              {ReviewItem({ name: 'byo_oidc_config_id_managed', formValues })}
              {ReviewItem({ name: 'byo_oidc_config_id', formValues })}
            </>
          )}
          {ReviewItem({ name: 'custom_operator_roles_prefix', formValues })}
        </ReviewSection>
      )}
      <ReviewSection title="Updates" onGoToStep={() => goToStepById(getStepId('CLUSTER_UPDATES'))}>
        {ReviewItem({ name: 'upgrade_policy', formValues })}
        {formValues.upgrade_policy === 'automatic' &&
          ReviewItem({ name: 'automatic_upgrade_schedule', formValues })}
        {ReviewItem({ name: 'node_drain_grace_period', formValues })}
      </ReviewSection>

      {config.fakeOSD && <DebugClusterRequest {...clusterRequestParams} />}
    </div>
  );
};
ReviewClusterScreen.propTypes = {
  change: PropTypes.func,
  clusterRequestParams: PropTypes.object.isRequired,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  isCreateClusterPending: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  installToVPCSelected: PropTypes.bool,
  configureProxySelected: PropTypes.bool,
  getUserRole: PropTypes.func.isRequired,
  getOCMRole: PropTypes.func.isRequired,
  getOCMRoleResponse: PropTypes.func.isRequired,
  getUserRoleResponse: PropTypes.object.isRequired,
  clearGetUserRoleResponse: PropTypes.func.isRequired,
  clearGetOcmRoleResponse: PropTypes.func.isRequired,
  goToStepById: PropTypes.func.isRequired,
  isHypershiftSelected: PropTypes.bool,
};

export default ReviewClusterScreen;
