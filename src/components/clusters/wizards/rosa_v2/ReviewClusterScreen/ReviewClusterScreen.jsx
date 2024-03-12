import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Title } from '@patternfly/react-core';
import { useSelector } from 'react-redux';

import config from '~/config';
import {
  HYPERSHIFT_WIZARD_FEATURE,
  HCP_AWS_BILLING_SHOW,
} from '~/redux/constants/featureConstants';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { hasSelectedSecurityGroups } from '~/common/securityGroupsHelpers';
import { getUserRoleForSelectedAWSAccount } from '~/components/clusters/wizards/rosa_v2/AccountsRolesScreen/AccountsRolesScreen';
import { stepId, stepNameById } from '~/components/clusters/wizards/common/osdWizardConstants';
import {
  stepId as rosaStepId,
  stepNameById as rosaStepNameById,
} from '~/components/clusters/wizards/rosa_v2/rosaWizardConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { useFormState } from '~/components/clusters/wizards/hooks';
import HiddenCheckbox from '~/components/common/FormikFormComponents/HiddenCheckbox';
import { canSelectImds } from '~/components/clusters/wizards/rosa/constants';
import { canAutoScaleOnCreateSelector } from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsSelectors';
import { DebugClusterRequest } from '../../common/DebugClusterRequest';
import ReviewSection, { ReviewItem } from '../../common/ReviewCluster/ReviewSection';
import ReviewRoleItem from './ReviewRoleItem';
import { FieldId } from '../constants';
import './ReviewClusterScreen.scss';

const ReviewClusterScreen = ({
  getUserRole,
  getOCMRole,
  getUserRoleResponse,
  getOCMRoleResponse,
  clearGetUserRoleResponse,
  clearGetOcmRoleResponse,
  goToStepById,
}) => {
  const {
    values: {
      [FieldId.Product]: product,
      [FieldId.InstallToVpc]: installToVPCSelected,
      [FieldId.ConfigureProxy]: configureProxySelected,
      [FieldId.Hypershift]: hypershiftValue,
      [FieldId.AutoscalingEnabled]: autoscalingEnabledValue,
      [FieldId.CloudProvider]: cloudProvider,
    },
    values: formValues,
    setFieldValue,
  } = useFormState();

  const canAutoScale = useSelector((state) => canAutoScaleOnCreateSelector(state, product));
  const autoscalingEnabled = canAutoScale && !!autoscalingEnabledValue;
  const isHypershiftSelected = hypershiftValue === 'true';

  const isByoc = formValues.byoc === 'true';
  const isAWS = formValues.cloud_provider === 'aws';
  const isGCP = formValues.cloud_provider === 'gcp';
  const isROSA = formValues.product === normalizedProducts.ROSA;
  const hasEtcdEncryption = isHypershiftSelected && !!formValues.etcd_key_arn;
  const hasCustomKeyARN = isByoc && formValues.kms_key_arn;
  const showVPCCheckbox = isROSA || isByoc;
  const hasAWSVPCSettings = showVPCCheckbox && formValues.install_to_vpc && isAWS;
  const clusterVersionRawId = formValues.cluster_version?.raw_id;

  const hasSecurityGroups = isByoc && hasSelectedSecurityGroups(formValues.securityGroups);

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
    ...(hasCustomKeyARN ? ['kms_key_arn'] : []),
    'etcd_encryption',
    ...(!isHypershiftSelected ? ['fips'] : []),
    ...(hasEtcdEncryption ? ['etcd_key_arn'] : []),
  ];

  const [userRole, setUserRole] = useState('');
  const [ocmRole, setOcmRole] = useState('');
  const [errorWithAWSAccountRoles, setErrorWithAWSAccountRoles] = useState(false);
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  const viewAWSBillingAcct = useFeatureGate(HCP_AWS_BILLING_SHOW);

  useEffect(() => {
    clearGetUserRoleResponse();
    clearGetOcmRoleResponse();
    // reset hidden form field to false
    setFieldValue('detected_ocm_and_user_roles', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOCMRoleResponse]);

  useEffect(() => {
    const hasError =
      getUserRoleResponse?.error || !userRole || getOCMRoleResponse?.error || !ocmRole;
    if (hasError !== errorWithAWSAccountRoles) {
      setErrorWithAWSAccountRoles(hasError);
      // setting hidden form field for field level validation
      setFieldValue('detected_ocm_and_user_roles', !hasError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserRoleResponse, getOCMRoleResponse, userRole, ocmRole, errorWithAWSAccountRoles]);

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
      <Title headingLevel="h2" className="pf-v5-u-pb-md">
        Review your {isROSA ? 'ROSA' : 'dedicated'} cluster
      </Title>
      {isROSA && (
        <>
          <HiddenCheckbox name={FieldId.DetectedOcmAndUserRoles} />
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
            {ReviewItem({ name: FieldId.AssociatedAwsId, formValues })}
            {isHypershiftSelected &&
              viewAWSBillingAcct &&
              ReviewItem({ name: FieldId.BillingAccountId, formValues })}
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
            {ReviewItem({ name: FieldId.InstallerRoleArn, formValues })}
            {ReviewItem({ name: FieldId.SupportRoleArn, formValues })}
            {!isHypershiftSelected && ReviewItem({ name: FieldId.ControlPlaneRoleArn, formValues })}
            {ReviewItem({ name: FieldId.WorkerRoleArn, formValues })}
          </ReviewSection>
        </>
      )}
      {!isROSA && (
        <ReviewSection
          title={getStepName('BILLING_MODEL')}
          onGoToStep={() => goToStepById(getStepId('BILLING_MODEL'))}
        >
          {ReviewItem({ name: FieldId.BillingModel, formValues })}
          {ReviewItem({ name: FieldId.Byoc, formValues })}
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
        {showVPCCheckbox &&
          ReviewItem({
            name: isHypershiftSelected ? 'selected_vpc' : 'install_to_vpc',
            formValues,
          })}
        {hasAWSVPCSettings &&
          isHypershiftSelected &&
          ReviewItem({
            name: 'aws_hosted_machine_pools',
            formValues,
          })}
        {!(formValues.node_labels?.length === 1 && isEmpty(formValues.node_labels?.[0])) &&
          ReviewItem({ name: 'node_labels', formValues })}
        {isAWS &&
          !isHypershiftSelected &&
          isByoc &&
          canSelectImds(clusterVersionRawId) &&
          ReviewItem({ name: 'imds', formValues })}
        {formValues.worker_volume_size_gib &&
          ReviewItem({ name: 'worker_volume_size_gib', formValues })}
      </ReviewSection>
      <ReviewSection
        title={getStepName('NETWORKING')}
        onGoToStep={() =>
          goToStepById(getStepId(`NETWORKING__${isAWS ? 'CONFIGURATION' : 'CIDR_RANGES'}`))
        }
      >
        {ReviewItem({ name: 'cluster_privacy', formValues })}
        {formValues.cluster_privacy_public_subnet_id &&
          isHypershiftSelected &&
          ReviewItem({
            name: 'cluster_privacy_public_subnet_id',
            formValues,
          })}
        {showVPCCheckbox &&
          formValues.cluster_privacy === 'internal' &&
          formValues.install_to_vpc &&
          ReviewItem({ name: 'use_privatelink', formValues })}
        {hasAWSVPCSettings &&
          !isHypershiftSelected &&
          ReviewItem({
            name: 'aws_standalone_vpc',
            formValues,
          })}
        {hasAWSVPCSettings &&
          !isHypershiftSelected &&
          hasSecurityGroups &&
          ReviewItem({
            name: 'securityGroups',
            formValues,
          })}
        {formValues.shared_vpc?.is_selected &&
          !isHypershiftSelected &&
          ReviewItem({
            name: 'shared_vpc',
            formValues,
          })}
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

        {isAWS &&
          !isHypershiftSelected &&
          isByoc &&
          ReviewItem({ name: 'applicationIngress', formValues })}
        {formValues.applicationIngress !== 'default' &&
          isAWS &&
          !isHypershiftSelected &&
          isByoc && (
            <>
              {ReviewItem({ name: 'defaultRouterSelectors', formValues })}
              {ReviewItem({ name: 'defaultRouterExcludedNamespacesFlag', formValues })}
              {ReviewItem({ name: 'isDefaultRouterWildcardPolicyAllowed', formValues })}
              {ReviewItem({ name: 'isDefaultRouterNamespaceOwnershipPolicyStrict', formValues })}
            </>
          )}
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
        {!isHypershiftSelected && ReviewItem({ name: 'node_drain_grace_period', formValues })}
      </ReviewSection>

      {config.fakeOSD && (
        <DebugClusterRequest
          cloudProvider={cloudProvider}
          product={product}
          formValues={formValues}
        />
      )}
    </div>
  );
};

ReviewClusterScreen.propTypes = {
  getUserRole: PropTypes.func.isRequired,
  getOCMRole: PropTypes.func.isRequired,
  getOCMRoleResponse: PropTypes.func.isRequired,
  getUserRoleResponse: PropTypes.object.isRequired,
  clearGetUserRoleResponse: PropTypes.func.isRequired,
  clearGetOcmRoleResponse: PropTypes.func.isRequired,
  goToStepById: PropTypes.func.isRequired,
};

export default ReviewClusterScreen;
