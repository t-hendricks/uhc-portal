import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Title, Bullseye, Stack, StackItem, Spinner } from '@patternfly/react-core';
import DebugClusterRequest from '../../DebugClusterRequest';
import config from '../../../../../config';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import './ReviewClusterScreen.scss';
import ReviewSection, { ReviewItem, ReviewRoleItem } from './ReviewSection';
import ReduxHiddenCheckbox from '../../../../common/ReduxFormComponents/ReduxHiddenCheckbox';
import { getUserRoleForSelectedAWSAccount } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/AccountsRolesScreen/AccountsRolesScreen';

function ReviewClusterScreen({
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
}) {
  const isByoc = formValues.byoc === 'true';
  const isAWS = formValues.cloud_provider === 'aws';
  const isGCP = formValues.cloud_provider === 'gcp';
  const isROSA = formValues.product === normalizedProducts.ROSA;
  const showVPCCheckbox = isROSA || isByoc;
  const clusterSettingsFields = [
    !isROSA && 'cloud_provider',
    'name',
    'cluster_version',
    'region',
    'multi_az',
    !isByoc && !isROSA && 'persistent_storage',
    !isByoc && isROSA && 'load_balancers',
    isByoc && isAWS && !isROSA && 'disable_scp_checks',
    'enable_user_workload_monitoring',
    isByoc && 'customer_managed_key',
    'etcd_encryption',
  ].filter(Boolean);
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

  return (
    <div className="ocm-create-osd-review-screen">
      <Title headingLevel="h2" className="pf-u-pb-md">
        Review your {isROSA ? 'ROSA' : 'dedicated'} cluster
      </Title>
      {isROSA && (
        <>
          <ReduxHiddenCheckbox name="detected_ocm_and_user_roles" />
          <ReviewSection title="Accounts and roles" initiallyExpanded={errorWithAWSAccountRoles}>
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
            {ReviewItem({ name: 'control_plane_role_arn', formValues })}
            {ReviewItem({ name: 'worker_role_arn', formValues })}
          </ReviewSection>
        </>
      )}
      {!isROSA && (
        <ReviewSection title="Billing Model">
          {ReviewItem({ name: 'billing_model', formValues })}
          {ReviewItem({ name: 'byoc', formValues })}
        </ReviewSection>
      )}
      <ReviewSection title="Cluster settings">
        {clusterSettingsFields.map((name) => ReviewItem({ name, formValues }))}
      </ReviewSection>
      <ReviewSection title="Default machine pool">
        {ReviewItem({ name: 'machine_type', formValues })}
        {canAutoScale && ReviewItem({ name: 'autoscalingEnabled', formValues })}
        {autoscalingEnabled
          ? ReviewItem({ name: 'min_replicas', formValues })
          : ReviewItem({ name: 'nodes_compute', formValues })}
        {!(formValues.node_labels.length === 1 && isEmpty(formValues.node_labels[0])) &&
          ReviewItem({ name: 'node_labels', formValues })}
      </ReviewSection>
      <ReviewSection title="Networking">
        {ReviewItem({ name: 'cluster_privacy', formValues })}
        {showVPCCheckbox && ReviewItem({ name: 'install_to_vpc', formValues })}
        {showVPCCheckbox &&
          formValues.cluster_privacy === 'internal' &&
          formValues.install_to_vpc &&
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
        <ReviewSection title="Cluster roles and policies">
          {ReviewItem({ name: 'rosa_roles_provider_creation_mode', formValues })}
          {ReviewItem({ name: 'custom_operator_roles_prefix', formValues })}
        </ReviewSection>
      )}
      <ReviewSection title="Updates">
        {ReviewItem({ name: 'upgrade_policy', formValues })}
        {formValues.upgrade_policy === 'automatic' &&
          ReviewItem({ name: 'automatic_upgrade_schedule', formValues })}
        {ReviewItem({ name: 'node_drain_grace_period', formValues })}
      </ReviewSection>

      {config.fakeOSD && <DebugClusterRequest {...clusterRequestParams} />}
    </div>
  );
}
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
};

export default ReviewClusterScreen;
