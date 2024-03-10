import React from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'formik';
import { CheckboxField } from '~/components/clusters/wizards/form/CheckboxField';

import {
  Form,
  Grid,
  GridItem,
  Title,
  Flex,
  FormGroup,
  SplitItem,
  Split,
  ExpandableSection,
  Alert,
} from '@patternfly/react-core';

import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { Version } from '~/types/clusters_mgmt.v1';
import { noQuotaTooltip } from '~/common/helpers';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import {
  getMinReplicasCount,
  getNodesCount,
} from '~/components/clusters/common/ScaleSection/AutoScaleSection/AutoScaleHelper';
import {
  asyncValidateClusterName,
  clusterNameAsyncValidation,
  clusterNameValidation,
  createPessimisticValidator,
  validateAWSKMSKeyARN,
} from '~/common/validators';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import PopoverHint from '~/components/common/PopoverHint';
import PersistentStorageDropdown from '~/components/clusters/common/PersistentStorageDropdown';
import LoadBalancersDropdown from '~/components/clusters/common/LoadBalancersDropdown';
import {
  RadioGroupField,
  RadioGroupOption,
  RichInputField,
} from '~/components/clusters/wizards/form';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SupportedFeature } from '~/common/featureCompatibility';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { hasAvailableQuota, quotaParams } from '~/components/clusters/wizards/common/utils/quotas';
import { FieldId, MIN_SECURE_BOOT_VERSION } from '~/components/clusters/wizards/osd/constants';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/createOSDInitialValues';
import { billingModels } from '~/common/subscriptionTypes';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';
import { QuotaParams } from '~/components/clusters/common/quotaModel';
import { GCP_SECURE_BOOT_UI } from '~/redux/constants/featureConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { versionComparator } from '~/common/versionComparator';
import { VersionSelectField } from '~/components/clusters/wizards/common/ClusterSettings/Details/VersionSelectField';
import CloudRegionSelectField from '~/components/clusters/wizards/common/ClusterSettings/Details/CloudRegionSelectField';
import { CustomerManagedEncryption } from '~/components/clusters/wizards/osd/ClusterSettings/Details/CustomerManagedEncryption';
import { ClassicEtcdFipsSection } from '~/components/clusters/wizards/common/ClusterSettings/Details/ClassicEtcdFipsSection';

export const Details = () => {
  const dispatch = useDispatch();
  const {
    values: {
      [FieldId.Byoc]: byoc,
      [FieldId.MultiAz]: multiAz,
      [FieldId.Product]: product,
      [FieldId.BillingModel]: billingModel,
      [FieldId.Region]: region,
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.CustomerManagedKey]: hasCustomerManagedKey,
      [FieldId.KmsKeyArn]: kmsKeyArn,
      [FieldId.ClusterVersion]: selectedVersion,
      [FieldId.SecureBoot]: secureBoot,
      [FieldId.MachinePoolsSubnets]: machinePoolsSubnets,
    },
    errors,
    isValidating,
    setFieldValue,
    getFieldProps,
  } = useFormState();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showSecureBootAlert, setShowSecureBootAlert] = React.useState(false);

  const isByoc = byoc === 'true';
  const isMultiAz = multiAz === 'true';
  const isGCP = cloudProvider === CloudProviderType.Gcp;

  const {
    organization: { quotaList },
  } = useGlobalState((state) => state.userProfile);

  const { gcpKeyRings } = useGlobalState((state) => state.ccsInquiries);

  const {
    [FieldId.KeyRing]: keyRingError,
    [FieldId.KeyName]: keyNameError,
    [FieldId.KmsServiceAccount]: kmsServiceAccountError,
    [FieldId.KeyLocation]: keyLocationError,
  } = errors;

  const isGCPError =
    gcpKeyRings.error || keyRingError || keyNameError || kmsServiceAccountError || keyLocationError;

  const isIncompatibleSecureBootVersion =
    isGCP && versionComparator(selectedVersion?.raw_id, MIN_SECURE_BOOT_VERSION) === -1;

  React.useEffect(() => {
    dispatch(getCloudProviders());
  }, [dispatch]);

  React.useEffect(() => {
    if (hasCustomerManagedKey === 'true') {
      if ((isGCP && isGCPError) || (!isGCP && validateAWSKMSKeyARN(kmsKeyArn, region))) {
        setIsExpanded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating]);

  React.useEffect(() => {
    if (!secureBoot && !isIncompatibleSecureBootVersion) {
      setShowSecureBootAlert(false);
    }
    if (secureBoot && isIncompatibleSecureBootVersion) {
      setShowSecureBootAlert(true);
      setFieldValue(FieldId.SecureBoot, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIncompatibleSecureBootVersion]);

  const azQuotaParams = {
    product,
    billingModel,
    isBYOC: isByoc,
    cloudProviderID: cloudProvider,
  } as QuotaParams;

  const hasSingleAzResources = hasAvailableQuota(quotaList as QuotaCostList, {
    ...quotaParams.singleAzResources,
    ...azQuotaParams,
  });

  const hasMultiAzResources = hasAvailableQuota(quotaList as QuotaCostList, {
    ...quotaParams.multiAzResources,
    ...azQuotaParams,
  });

  const handleCloudRegionChange = () => {
    // Clears fields related to the region: VPC and machinePoolsSubnets
    const azCount = isMultiAz ? 3 : 1;
    const mpSubnetsReset = [];

    for (let i = 0; i < azCount; i += 1) {
      mpSubnetsReset.push(emptyAWSSubnet());
    }

    setFieldValue(FieldId.MachinePoolsSubnets, mpSubnetsReset);
    setFieldValue(FieldId.SelectedVpc, '');
  };

  const handleMultiAzChange = (_event: React.FormEvent<HTMLDivElement>, value: string) => {
    const isMultiAz = value === 'true';

    // When multiAz changes, update the node count
    setFieldValue(FieldId.NodesCompute, getNodesCount(isByoc, isMultiAz, true));
    setFieldValue(FieldId.MinReplicas, getMinReplicasCount(isByoc, isMultiAz, true));
    setFieldValue(FieldId.MaxReplicas, '');
    setFieldValue(FieldId.MaxReplicas, '');

    // Make "machinePoolsSubnets" of the correct length
    const mpSubnetsReset = [machinePoolsSubnets[0]];
    if (isMultiAz) {
      mpSubnetsReset.push(emptyAWSSubnet());
      mpSubnetsReset.push(emptyAWSSubnet());
    }
    setFieldValue(FieldId.MachinePoolsSubnets, mpSubnetsReset);
  };

  const handleVersionChange = (clusterVersion: Version) => {
    // If features become incompatible with the new version, clear their settings
    const canDefineSecurityGroups = !getIncompatibleVersionReason(
      SupportedFeature.SECURITY_GROUPS,
      clusterVersion.raw_id,
      { day1: true },
    );
    if (!canDefineSecurityGroups) {
      setFieldValue(FieldId.SecurityGroups, {
        applyControlPlaneToAll: true,
        controlPlane: [],
        infra: [],
        worker: [],
      });
    }
  };

  const availabilityZoneOptions: RadioGroupOption[] = [
    {
      value: 'false',
      label: 'Single zone',
      disabled: !hasSingleAzResources,
      popoverHint: constants.availabilityHintSingleZone,
      ...(!hasSingleAzResources && { tooltip: noQuotaTooltip }),
    },
    {
      value: 'true',
      label: 'Multi-zone',
      disabled: !hasMultiAzResources,
      popoverHint: constants.availabilityHintMultiZone,
      ...(!hasMultiAzResources && { tooltip: noQuotaTooltip }),
    },
  ];

  const validateClusterName = async (value: string) => {
    const syncError = createPessimisticValidator(clusterNameValidation)(value);
    if (syncError) {
      return syncError;
    }

    const clusterNameAsyncError = await asyncValidateClusterName(value);
    if (clusterNameAsyncError) {
      return clusterNameAsyncError;
    }

    return undefined;
  };

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isSecureBootFeatureEnabled = useFeatureGate(GCP_SECURE_BOOT_UI);

  const secureBootAlert = (
    <div className="pf-v5-u-mt-sm">
      <Alert
        isInline
        variant="danger"
        title={`Secure Boot support requires OpenShift version ${MIN_SECURE_BOOT_VERSION} or above`}
      />
    </div>
  );

  return (
    <Form>
      <Grid hasGutter md={6}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <Title headingLevel="h3">Cluster details</Title>

          <GridItem>
            <Field
              component={RichInputField}
              name={FieldId.ClusterName}
              label="Cluster name"
              type="text"
              validate={validateClusterName}
              validation={clusterNameValidation}
              asyncValidation={clusterNameAsyncValidation}
              isRequired
              extendedHelpText={constants.clusterNameHint}
              input={{
                ...getFieldProps(FieldId.ClusterName),
                onChange: (value: string) => setFieldValue(FieldId.ClusterName, value, false),
              }}
            />
          </GridItem>

          <GridItem>
            <VersionSelectField
              name={FieldId.ClusterVersion}
              label={
                billingModel === billingModels.MARKETPLACE_GCP
                  ? 'Version (Google Cloud Marketplace enabled)'
                  : 'Version'
              }
              onChange={handleVersionChange}
            />
          </GridItem>

          <GridItem>
            <FormGroup
              label="Region"
              isRequired
              fieldId={FieldId.Region}
              labelIcon={<PopoverHint hint={constants.regionHint} />}
            >
              <Field
                component={CloudRegionSelectField}
                name={FieldId.Region}
                cloudProviderID={cloudProvider}
                isMultiAz={isMultiAz}
                isBYOC={isByoc}
                handleCloudRegionChange={handleCloudRegionChange}
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <RadioGroupField
              label="Availability"
              name={FieldId.MultiAz}
              options={availabilityZoneOptions}
              onChange={handleMultiAzChange}
              direction="row"
              isRequired
            />
          </GridItem>

          {!isByoc && (
            <>
              <GridItem>
                <FormGroup
                  label="Persistent storage"
                  fieldId={FieldId.PersistentStorage}
                  labelIcon={<PopoverHint hint={constants.persistentStorageHint} />}
                >
                  <Field
                    name={FieldId.PersistentStorage}
                    input={{
                      ...getFieldProps(FieldId.PersistentStorage),
                      onChange: (value: string) => setFieldValue(FieldId.PersistentStorage, value),
                    }}
                    component={PersistentStorageDropdown}
                    cloudProviderID={cloudProvider}
                    billingModel={billingModel}
                    product={product}
                    isBYOC={isByoc}
                    isMultiAZ={isMultiAz}
                  />
                </FormGroup>
              </GridItem>

              <GridItem>
                <FormGroup
                  label="Load balancers"
                  fieldId={FieldId.LoadBalancers}
                  labelIcon={<PopoverHint hint={constants.loadBalancersHint} />}
                >
                  <Field
                    name={FieldId.LoadBalancers}
                    input={{
                      ...getFieldProps(FieldId.LoadBalancers),
                      onChange: (value: string) => setFieldValue(FieldId.LoadBalancers, value),
                    }}
                    component={LoadBalancersDropdown}
                    currentValue={null}
                    cloudProviderID={cloudProvider}
                    billingModel={billingModel}
                    product={product}
                    isBYOC={isByoc}
                    isMultiAZ={isMultiAz}
                  />
                </FormGroup>
              </GridItem>
            </>
          )}
          {isGCP && isSecureBootFeatureEnabled && (
            <GridItem>
              <FormGroup label="Shielded VM" fieldId={FieldId.SecureBoot}>
                <Split hasGutter className="pf-u-mb-0">
                  <SplitItem>
                    <CheckboxField
                      name={FieldId.SecureBoot}
                      label="Enable Secure Boot support for Shielded VMs"
                      isDisabled={isIncompatibleSecureBootVersion}
                    />
                  </SplitItem>
                  <SplitItem>
                    <PopoverHint hint={constants.enableSecureBootHint} />
                  </SplitItem>
                </Split>
                {showSecureBootAlert && secureBootAlert}
              </FormGroup>
            </GridItem>
          )}
          <GridItem>
            <Title headingLevel="h4">Monitoring</Title>
          </GridItem>

          <Split hasGutter className="pf-v5-u-mb-0">
            <SplitItem>
              <CheckboxField
                name={FieldId.EnableUserWorkloadMonitoring}
                label="Enable user workload monitoring"
              />
            </SplitItem>
            <SplitItem>
              <PopoverHint
                hint={
                  <>
                    {constants.enableUserWorkloadMonitoringHelp}
                    <ExternalLink href={links.OSD_MONITORING_STACK}>Learn more</ExternalLink>
                  </>
                }
              />
            </SplitItem>
          </Split>
          <div className="pf-v5-u-font-size-sm pf-v5-u-color-200 pf-v5-u-ml-lg pf-v5-u-mt-xs">
            {constants.enableUserWorkloadMonitoringHint}
          </div>

          <ExpandableSection
            toggleText="Advanced Encryption"
            onToggle={onToggle}
            isExpanded={isExpanded}
          >
            {isByoc && (
              <CustomerManagedEncryption
                hasCustomerManagedKey={hasCustomerManagedKey}
                region={region}
                cloudProvider={cloudProvider}
                kmsKeyArn={kmsKeyArn}
              />
            )}

            <ClassicEtcdFipsSection isRosa={false} />
          </ExpandableSection>
        </Flex>
      </Grid>
    </Form>
  );
};
