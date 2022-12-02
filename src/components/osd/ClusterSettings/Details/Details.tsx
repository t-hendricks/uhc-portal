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
  Alert,
  SplitItem,
  Split,
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
} from '~/common/validators';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import PopoverHint from '~/components/common/PopoverHint';
import PersistentStorageDropdown from '~/components/clusters/common/PersistentStorageDropdown';
import LoadBalancersDropdown from '~/components/clusters/common/LoadBalancersDropdown';
import { PLACEHOLDER_VALUE as AvailabilityZonePlaceholder } from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';

import { RadioGroupField, RichInputField } from '../../common/form';
import { hasAvailableQuota, quotaParams, QuotaParams } from '../../utils';
import { FieldId } from '../../constants';
import { useFormState } from '../../hooks';
import { CloudProviderType } from '../CloudProvider/types';
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
    },
    setFieldValue,
    getFieldProps,
    setFieldError,
  } = useFormState();
  const isByoc = byoc === 'true';
  const isMultiAz = multiAz === 'true';
  const cloudProviderLearnLink =
    cloudProvider === CloudProviderType.Aws
      ? 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html'
      : 'https://cloud.google.com/storage/docs/encryption/default-keys';

  const {
    organization: { quotaList },
  } = useGlobalState((state) => state.userProfile);

  React.useEffect(() => {
    dispatch(getCloudProviders());
  }, []);

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

  const availabilityZoneOptions = [
    {
      value: 'false',
      label: 'Single zone',
      disabled: !hasSingleAzResources,
      extendedHelpText: constants.availabilityHintSingleZone,
      ...(!hasSingleAzResources && { tooltipText: noQuotaTooltip }),
    },
    {
      value: 'true',
      label: 'Multi-zone',
      disabled: !hasMultiAzResources,
      extendedHelpText: constants.availabilityHintMultiZone,
      ...(!hasMultiAzResources && { tooltipText: noQuotaTooltip }),
    },
  ];

  const onClusterNameBlur = async (event: React.FocusEvent<any>) => {
    const value = event?.target?.value;

    if (value) {
      const clusterNameAsyncError = await asyncValidateClusterName(value);

      if (clusterNameAsyncError) {
        setFieldError(FieldId.ClusterName, clusterNameAsyncError);
      }
    }
  };

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
                onBlur: onClusterNameBlur,
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
              isRequired
              isInline
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
            <Title headingLevel="h3">Monitoring</Title>
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

          <GridItem>
            <Title headingLevel="h3" className="pf-u-mb-sm">
              Encryption
            </Title>

            <Alert
              isInline
              variant="info"
              title="The cloud storage for your cluster is encrypted at rest."
            >
              <ExternalLink href={cloudProviderLearnLink}>Learn more</ExternalLink>
            </Alert>
          </GridItem>

          <Grid hasGutter>
            <GridItem>
              <Split hasGutter>
                <SplitItem>
                  <CheckboxField
                    name={FieldId.EtcdEncryption}
                    label="Enable additional etcd encryption"
                  />
                </SplitItem>
                <SplitItem>
                  <PopoverHint
                    hint={
                      <>
                        {constants.enableAdditionalEtcdHint}
                        <ExternalLink href={links.OSD_ETCD_ENCRYPTION}>
                          Learn more about etcd encryption
                        </ExternalLink>
                      </>
                    }
                  />
                </SplitItem>
              </Split>
              <div className="pf-u-font-size-sm pf-u-color-200 pf-u-ml-lg pf-u-mt-xs">
                Additional encryption of OpenShift and Kubernetes API resources.
              </div>
            </GridItem>
          </Grid>

          {isByoc && (
            <CustomerManagedEncryption
              hasCustomerManagedKey={hasCustomerManagedKey}
              region={region}
              cloudProvider={cloudProvider}
            />
          )}
        </Flex>
      </Grid>
    </Form>
  );
};
