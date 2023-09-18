import React from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'formik';
import { CheckboxField } from 'formik-pf';

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
} from '@patternfly/react-core';

import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { noQuotaTooltip } from '~/common/helpers';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import {
  getMinReplicasCount,
  getNodesCount,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleHelper';
import {
  asyncValidateClusterName,
  clusterNameAsyncValidation,
  clusterNameValidation,
  createPessimisticValidator,
  validateAWSKMSKeyARN,
} from '~/common/validators';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import PopoverHint from '~/components/common/PopoverHint';
import PersistentStorageDropdown from '~/components/clusters/common/PersistentStorageDropdown';
import LoadBalancersDropdown from '~/components/clusters/common/LoadBalancersDropdown';
import { PLACEHOLDER_VALUE as AvailabilityZonePlaceholder } from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import {
  RadioGroupField,
  RadioGroupOption,
  RichInputField,
} from '~/components/clusters/wizards/form';
import { useFormState } from '~/components/clusters/wizards/hooks';
import {
  hasAvailableQuota,
  quotaParams,
  QuotaParams,
} from '~/components/clusters/wizards/common/utils/quotas';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { VersionSelectField } from './VersionSelectField';
import CloudRegionSelectField from './CloudRegionSelectField';
import { CustomerManagedEncryption } from './CustomerManagedEncryption';

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
      [FieldId.EtcdEncryption]: etcdEncryption,
      [FieldId.FipsCryptography]: fipsCryptography,
    },
    errors,
    isValidating,
    setFieldValue,
    getFieldProps,
  } = useFormState();

  const [isExpanded, setIsExpanded] = React.useState(false);

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

  const azQuotaParams = {
    product,
    billingModel,
    isBYOC: isByoc,
    cloudProviderID: cloudProvider,
  } as QuotaParams;

  const hasSingleAzResources = hasAvailableQuota(quotaList, {
    ...quotaParams.singleAzResources,
    ...azQuotaParams,
  });

  const hasMultiAzResources = hasAvailableQuota(quotaList, {
    ...quotaParams.multiAzResources,
    ...azQuotaParams,
  });

  const handleCloudRegionChange = () => {
    // Set az selection to its default value once the cloudRegion changes to avoid incorrect zone.
    const azCount = isMultiAz ? 3 : 1;

    for (let i = 0; i < azCount; i += 1) {
      setFieldValue(`az_${i}`, AvailabilityZonePlaceholder);
    }
  };

  const handleMultiAzChange = (value: string) => {
    const isMultiAz = value === 'true';

    // When multiAz changes, update the node count
    setFieldValue(FieldId.NodesCompute, getNodesCount(isByoc, isMultiAz, true));
    setFieldValue(FieldId.MinReplicas, getMinReplicasCount(isByoc, isMultiAz, true));
    setFieldValue(FieldId.MaxReplicas, '');
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
            <VersionSelectField name={FieldId.ClusterVersion} label="Version" />
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

          <GridItem>
            <Title headingLevel="h4">Monitoring</Title>
          </GridItem>

          <Split hasGutter className="pf-u-mb-0">
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
          <div className="pf-u-font-size-sm pf-u-color-200 pf-u-ml-lg pf-u-mt-xs">
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
            <Grid hasGutter>
              <FormGroup label="etcd encryption">
                <GridItem>
                  <Split hasGutter>
                    <SplitItem>
                      <CheckboxField
                        name={FieldId.EtcdEncryption}
                        label="Enable additional etcd encryption"
                        isDisabled={fipsCryptography}
                      />
                    </SplitItem>
                    <SplitItem>
                      <PopoverHint
                        hint={
                          <>
                            {constants.enableAdditionalEtcdHint}{' '}
                            <ExternalLink href={links.OSD_ETCD_ENCRYPTION}>
                              Learn more about etcd encryption
                            </ExternalLink>
                          </>
                        }
                      />
                    </SplitItem>
                  </Split>
                  <div className="pf-u-font-size-sm pf-u-color-200 pf-u-ml-lg pf-u-mt-xs">
                    Add more encryption for OpenShift and Kubernetes API resources.
                  </div>
                </GridItem>
              </FormGroup>

              {etcdEncryption && (
                <FormGroup label="FIPS cryptography" className="pf-u-mt-md">
                  <GridItem>
                    <CheckboxField
                      name={FieldId.FipsCryptography}
                      label="Enable FIPS cryptography"
                    />
                    <div className="pf-u-font-size-sm pf-u-color-200 pf-u-ml-lg pf-u-mt-xs">
                      Install a cluster that uses FIPS Validated / Modules in Process cryptographic
                      libraries on the x86_64 architecture.
                    </div>
                  </GridItem>
                </FormGroup>
              )}
            </Grid>
          </ExpandableSection>
        </Flex>
      </Grid>
    </Form>
  );
};
