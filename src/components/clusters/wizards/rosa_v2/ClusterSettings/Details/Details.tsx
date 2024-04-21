import React, { useState } from 'react';
import { Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import {
  Alert,
  ExpandableSection,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';

import { SupportedFeature } from '~/common/featureCompatibility';
import { noQuotaTooltip } from '~/common/helpers';
import links from '~/common/installLinks.mjs';
import { getDefaultSecurityGroupsSettings } from '~/common/securityGroupsHelpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import {
  asyncValidateClusterName,
  asyncValidateDomainPrefix,
  clusterNameAsyncValidation,
  clusterNameValidation,
  createPessimisticValidator,
  domainPrefixAsyncValidation,
  domainPrefixValidation,
} from '~/common/validators';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { QuotaTypes } from '~/components/clusters/common/quotaModel';
import { availableQuota } from '~/components/clusters/common/quotaSelectors';
import {
  getMinReplicasCount,
  getNodesCount,
} from '~/components/clusters/common/ScaleSection/AutoScaleSection/AutoScaleHelper';
import { CloudProviderType } from '~/components/clusters/wizards/common';
import { ClassicEtcdFipsSection } from '~/components/clusters/wizards/common/ClusterSettings/Details/ClassicEtcdFipsSection';
import CloudRegionSelectField from '~/components/clusters/wizards/common/ClusterSettings/Details/CloudRegionSelectField';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/constants';
import { RadioGroupField, RichInputField } from '~/components/clusters/wizards/form';
import { CheckboxField } from '~/components/clusters/wizards/form/CheckboxField';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { createOperatorRolesHashPrefix } from '~/components/clusters/wizards/rosa_v2/ClusterRolesScreen/ClusterRolesScreen';
import { AWSCustomerManagedEncryption } from '~/components/clusters/wizards/rosa_v2/ClusterSettings/Details/AWSCustomerManagedEncryption';
import { HCPEtcdEncryptionSection } from '~/components/clusters/wizards/rosa_v2/ClusterSettings/Details/HCPEtcdEncryptionSection';
import VersionSelection from '~/components/clusters/wizards/rosa_v2/ClusterSettings/VersionSelection';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { getMachineTypesByRegionARN } from '~/redux/actions/machineTypesActions';
import { LONGER_CLUSTER_NAME_UI } from '~/redux/constants/featureConstants';
import { useGlobalState } from '~/redux/hooks';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';
import { Version } from '~/types/clusters_mgmt.v1';

function Details() {
  const {
    values: {
      [FieldId.Hypershift]: hypershiftValue,
      [FieldId.MultiAz]: multiAz,
      [FieldId.BillingModel]: billingModel,
      [FieldId.Region]: region,
      [FieldId.MachinePoolsSubnets]: machinePoolsSubnets,
      [FieldId.ClusterPrivacy]: clusterPrivacy,
      [FieldId.InstallerRoleArn]: installerRoleArn,
      [FieldId.HasDomainPrefix]: hasDomainPrefix,
    },
    errors,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
    validateForm,
  } = useFormState();

  const machineTypesByRegion = useSelector((state: any) => state.machineTypesByRegion);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // if machineTypeByRegion.region cache does not exist or if the region is new, load new machines
    if (
      region &&
      (!machineTypesByRegion.region ||
        (machineTypesByRegion.region && machineTypesByRegion.region.id !== region))
    ) {
      dispatch(getMachineTypesByRegionARN(installerRoleArn, region));
    }
  }, [region, installerRoleArn, machineTypesByRegion.region, dispatch]);

  const isHypershiftSelected = hypershiftValue === 'true';
  const isMultiAz = multiAz === 'true';

  const [isExpanded, setIsExpanded] = useState(false);
  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Region change may invalidate various fields.
  React.useEffect(() => {
    validateForm();
  }, [region, validateForm]);

  // Expand section to reveal validation errors.
  React.useEffect(() => {
    if (errors[FieldId.KmsKeyArn]) {
      setIsExpanded(true);
      setFieldTouched(FieldId.KmsKeyArn);
    }

    if (errors[FieldId.EtcdKeyArn]) {
      setIsExpanded(true);
      setFieldTouched(FieldId.EtcdKeyArn);
    }
  }, [errors, setFieldTouched]);

  const {
    organization: { quotaList },
  } = useGlobalState((state) => state.userProfile);

  const isLongerClusterNameEnabled = useFeatureGate(LONGER_CLUSTER_NAME_UI);
  const clusterNameMaxLength = isLongerClusterNameEnabled ? 54 : 15;

  const validateClusterName = async (value: string) => {
    const syncError = createPessimisticValidator(clusterNameValidation)(
      value,
      clusterNameMaxLength,
    );
    if (syncError) {
      return syncError;
    }

    const clusterNameAsyncError = await asyncValidateClusterName(value);
    if (clusterNameAsyncError) {
      return clusterNameAsyncError;
    }

    return undefined;
  };

  const validateDomainPrefix = async (value: string) => {
    const syncError = createPessimisticValidator(domainPrefixValidation)(value);
    if (syncError) {
      return syncError;
    }

    const domainPrefixAsyncError = await asyncValidateDomainPrefix(value);
    if (domainPrefixAsyncError) {
      return domainPrefixAsyncError;
    }

    return undefined;
  };

  const handleVersionChange = (clusterVersion: Version) => {
    // If features become incompatible with the new version, clear their settings
    const canDefineSecurityGroups = !getIncompatibleVersionReason(
      SupportedFeature.SECURITY_GROUPS,
      clusterVersion.raw_id,
      { day1: true },
    );
    if (!canDefineSecurityGroups) {
      setFieldValue(FieldId.SecurityGroups, getDefaultSecurityGroupsSettings());
    }
  };

  const handleCloudRegionChange = () => {
    // Clears fields related to the region: Availability zones, subnet IDs, VPCs
    const mpSubnetsReset = new Array(isMultiAz ? 3 : 1).fill(emptyAWSSubnet());
    setFieldValue(FieldId.MachinePoolsSubnets, mpSubnetsReset);
    setFieldValue(FieldId.SelectedVpc, { id: '', name: '' });

    // Reset the public subnet ID selection associated with cluster privacy on region change,
    // since the list of values there can change entirely based on the selected region.
    if (clusterPrivacy === 'external') {
      setFieldValue(FieldId.ClusterPrivacyPublicSubnetId, '');
    }
  };

  // TODO: ensure billingModel is set by previous screens.
  const hasAzResources = (isMultiAz: boolean) => {
    const params = {
      product: normalizedProducts.ROSA,
      cloudProviderID: CloudProviderType.Aws,
      isBYOC: true,
      billingModel,
      isMultiAz,
    };
    // TODO: OCMUI-943: CCS requires quota for both cluster and node.
    //   But how many nodes does ROSA require at creation time?
    const clusterQuota = availableQuota(quotaList as QuotaCostList, {
      ...params,
      resourceType: QuotaTypes.CLUSTER,
    });
    return clusterQuota >= 1;
  };

  const quotaDisabledAndTooltip = (hasQuota: boolean) =>
    hasQuota
      ? {
          disabled: false,
        }
      : {
          disabled: true,
          tooltip: noQuotaTooltip,
        };

  const availabilityZoneOptions = [
    {
      value: 'false',
      label: 'Single zone',
      popoverHint: constants.availabilityHintSingleZone,
      ...quotaDisabledAndTooltip(hasAzResources(false)),
    },
    {
      value: 'true',
      label: 'Multi-zone',
      popoverHint: constants.availabilityHintMultiZone,
      ...quotaDisabledAndTooltip(hasAzResources(true)),
    },
  ];

  const handleMultiAzChange = (_event: React.FormEvent<HTMLDivElement>, value: string) => {
    // when multiAz changes, reset node count
    const isValueMultiAz = value === 'true';
    setFieldValue(FieldId.NodesCompute, getNodesCount(true, isValueMultiAz, true));
    const replicas = getMinReplicasCount(true, isValueMultiAz, true, isHypershiftSelected);
    setFieldValue(FieldId.MinReplicas, replicas);
    setFieldValue(FieldId.MaxReplicas, replicas);

    // Make "machinePoolsSubnets" of the correct length
    const mpSubnetsReset = [machinePoolsSubnets?.[0] || emptyAWSSubnet()];
    if (isMultiAz) {
      mpSubnetsReset.push(emptyAWSSubnet());
      mpSubnetsReset.push(emptyAWSSubnet());
    }
    setFieldValue(FieldId.MachinePoolsSubnets, mpSubnetsReset);
  };

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Cluster details</Title>
        </GridItem>
        <GridItem md={6}>
          <Field
            component={RichInputField}
            name={FieldId.ClusterName}
            label="Cluster name"
            type="text"
            validate={validateClusterName}
            validation={(value: string) => clusterNameValidation(value, clusterNameMaxLength)}
            asyncValidation={clusterNameAsyncValidation}
            isRequired
            extendedHelpText={constants.clusterNameHint}
            input={{
              ...getFieldProps(FieldId.ClusterName),
              onChange: (value: string) => {
                setFieldValue(FieldId.ClusterName, value, false);
                setFieldValue(
                  FieldId.CustomOperatorRolesPrefix,
                  `${value.slice(0, 27)}-${createOperatorRolesHashPrefix()}`,
                );
              },
            }}
          />
        </GridItem>
        <GridItem md={6} />

        {isLongerClusterNameEnabled && (
          <>
            <GridItem>
              <Split hasGutter className="pf-u-mb-0">
                <SplitItem>
                  <CheckboxField
                    name={FieldId.HasDomainPrefix}
                    label="Create custom domain prefix"
                  />
                </SplitItem>
                <SplitItem>
                  <PopoverHint hint={constants.domainPrefixHint} />
                </SplitItem>
              </Split>
            </GridItem>
            {hasDomainPrefix && (
              <>
                <GridItem md={6}>
                  <Field
                    component={RichInputField}
                    name={FieldId.DomainPrefix}
                    label="Domain prefix"
                    type="text"
                    validate={validateDomainPrefix}
                    validation={domainPrefixValidation}
                    asyncValidation={domainPrefixAsyncValidation}
                    isRequired
                    input={{
                      ...getFieldProps(FieldId.DomainPrefix),
                      onChange: (value: string) =>
                        setFieldValue(FieldId.DomainPrefix, value, false),
                    }}
                  />
                </GridItem>
                <GridItem md={6} />
              </>
            )}
          </>
        )}

        <GridItem md={6}>
          <VersionSelection label="Version" onChange={handleVersionChange} />
        </GridItem>
        <GridItem md={6} />

        <GridItem md={6}>
          <FormGroup
            label="Region"
            isRequired
            fieldId={FieldId.Region}
            labelIcon={<PopoverHint hint={constants.regionHint} />}
          >
            <Field
              component={CloudRegionSelectField}
              name={FieldId.Region}
              cloudProviderID={CloudProviderType.Aws}
              isBYOC
              isMultiAz={isMultiAz}
              isHypershiftSelected={isHypershiftSelected}
              handleCloudRegionChange={handleCloudRegionChange}
            />
          </FormGroup>
        </GridItem>
        <GridItem md={6} />

        {isHypershiftSelected ? (
          <Alert
            isInline
            variant="info"
            title="The hosted control plane uses multiple availability zones."
          />
        ) : (
          <>
            <GridItem md={6}>
              <RadioGroupField
                label="Availability"
                name={FieldId.MultiAz}
                options={availabilityZoneOptions}
                onChange={handleMultiAzChange}
                direction="row"
                isRequired
              />
            </GridItem>
            <GridItem md={6} />
          </>
        )}

        {!isHypershiftSelected && (
          <>
            <GridItem>
              <Title headingLevel="h4">Monitoring</Title>
            </GridItem>

            <GridItem>
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
                        <ExternalLink href={links.ROSA_MONITORING}>Learn more</ExternalLink>
                      </>
                    }
                  />
                </SplitItem>
              </Split>
              <div className="ocm-c--reduxcheckbox-description">
                {constants.enableUserWorkloadMonitoringHint}
              </div>
            </GridItem>
          </>
        )}

        <ExpandableSection
          toggleText="Advanced Encryption"
          onToggle={onToggle}
          isExpanded={isExpanded}
        >
          <Grid hasGutter>
            <AWSCustomerManagedEncryption />

            {isHypershiftSelected ? (
              <HCPEtcdEncryptionSection />
            ) : (
              <ClassicEtcdFipsSection isRosa />
            )}
          </Grid>
        </ExpandableSection>
      </Grid>
    </Form>
  );
}

export default Details;
