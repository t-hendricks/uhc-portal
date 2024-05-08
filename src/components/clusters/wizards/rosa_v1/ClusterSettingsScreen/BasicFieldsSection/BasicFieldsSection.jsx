import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Alert, FormGroup, GridItem } from '@patternfly/react-core';

import { SupportedFeature } from '~/common/featureCompatibility';
import { noQuotaTooltip } from '~/common/helpers';
import { getDefaultSecurityGroupsSettings } from '~/common/securityGroupsHelpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import {
  getMinReplicasCount,
  getNodesCount,
} from '~/components/clusters/common/ScaleSection/AutoScaleSection/AutoScaleHelper';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/constants';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { LONGER_CLUSTER_NAME_UI } from '~/redux/constants/featureConstants';

import {
  clusterNameAsyncValidation,
  clusterNameValidation,
  createPessimisticValidator,
  domainPrefixAsyncValidation,
  domainPrefixValidation,
} from '../../../../../../common/validators';
import PopoverHint from '../../../../../common/PopoverHint';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import ReduxRichInputField from '../../../../../common/ReduxFormComponents/ReduxRichInputField';
import { createOperatorRolesPrefix } from '../../ClusterRolesScreen/clusterRolesHelper';

import CloudRegionComboBox from './CloudRegionComboBox';
import VersionSelection from './VersionSelection';

function BasicFieldsSection({
  pending,
  showAvailability,
  product,
  cloudProviderID,
  isBYOC,
  isMultiAz,
  hasSingleAzQuota,
  hasMultiAzQuota,
  change,
  isWizard,
  isHypershiftSelected,
  clusterPrivacy,
  hasDomainPrefix,
}) {
  const multiAzTooltip = !hasMultiAzQuota && noQuotaTooltip;
  const singleAzTooltip = !hasSingleAzQuota && noQuotaTooltip;
  const isRosa = product === normalizedProducts.ROSA;

  const handleCloudRegionChange = () => {
    // Clears fields related to the region: Availability zones, subnet IDs, VPCs
    const azCount = isMultiAz ? 3 : 1;
    const mpSubnetsReset = [];

    for (let i = 0; i < azCount; i += 1) {
      mpSubnetsReset.push(emptyAWSSubnet());
    }

    change('machinePoolsSubnets', mpSubnetsReset);
    change('selected_vpc', { id: '', name: '' });

    // Reset the public subnet ID selection associated with cluster privacy on region change,
    // since the list of values there can change entirely based on the selected region.
    if (clusterPrivacy === 'external') {
      change('cluster_privacy_public_subnet_id', '');
    }
  };

  const handleMultiAZChange = (_, value) => {
    // when multiAz changes, reset node count
    const isValueMultiAz = value === 'true';
    change('nodes_compute', getNodesCount(isBYOC, isValueMultiAz, true));
    change('min_replicas', getMinReplicasCount(isBYOC, isValueMultiAz, true, isHypershiftSelected));
    change('max_replicas', getMinReplicasCount(isBYOC, isValueMultiAz, true, isHypershiftSelected));

    if (isValueMultiAz) {
      change('machinePoolsSubnets', [emptyAWSSubnet(), emptyAWSSubnet(), emptyAWSSubnet()]);
    } else {
      change('machinePoolsSubnets', [emptyAWSSubnet()]);
    }
  };

  const handleVersionChange = (clusterVersion) => {
    // If features become incompatible with the new version, clear their settings
    const canDefineSecurityGroups = !getIncompatibleVersionReason(
      SupportedFeature.SECURITY_GROUPS,
      clusterVersion.raw_id,
      { day1: true, isHypershift: isHypershiftSelected },
    );
    if (!canDefineSecurityGroups) {
      change('securityGroups', getDefaultSecurityGroupsSettings());
    }
  };

  const isLongerClusterNameEnabled = useFeatureGate(LONGER_CLUSTER_NAME_UI);
  const clusterNameMaxLength = isLongerClusterNameEnabled ? 54 : 15;

  return (
    <>
      {/* cluster name */}
      <GridItem md={6}>
        <Field
          component={ReduxRichInputField}
          name="name"
          label="Cluster name"
          type="text"
          validate={(value) =>
            createPessimisticValidator(clusterNameValidation)(value, clusterNameMaxLength)
          }
          validation={(value) => clusterNameValidation(value, clusterNameMaxLength)}
          asyncValidation={clusterNameAsyncValidation}
          disabled={pending}
          isRequired
          extendedHelpText={constants.clusterNameHint}
          onChange={(value) =>
            isRosa && change('custom_operator_roles_prefix', createOperatorRolesPrefix(value))
          }
        />
      </GridItem>
      <GridItem md={6} />

      {/* domain prefix */}
      {isLongerClusterNameEnabled && (
        <>
          <GridItem md={6}>
            <Field
              component={ReduxCheckbox}
              name="has_domain_prefix"
              label="Create custom domain prefix"
              extendedHelpText={constants.domainPrefixHint}
              onClick={() => change('domain_prefix', '')}
            />
          </GridItem>
          <GridItem md={6} />
          {hasDomainPrefix && (
            <>
              <GridItem md={6}>
                <Field
                  component={ReduxRichInputField}
                  name="domain_prefix"
                  label="Domain prefix"
                  type="text"
                  validate={createPessimisticValidator(domainPrefixValidation)}
                  validation={domainPrefixValidation}
                  asyncValidation={domainPrefixAsyncValidation}
                  isRequired
                />
              </GridItem>
              <GridItem md={6} />
            </>
          )}
        </>
      )}

      {/* Cluster Versions */}
      <>
        <GridItem md={6}>
          <Field
            component={VersionSelection}
            name="cluster_version"
            label="Version"
            isRequired
            validate={(value) => (value ? undefined : ' ')}
            isRosa={isRosa}
            onChange={handleVersionChange}
          />
        </GridItem>
        <GridItem md={6} />
      </>

      {/* Region */}
      <GridItem md={6}>
        <FormGroup
          label="Region"
          isRequired
          fieldId="region"
          labelIcon={<PopoverHint hint={constants.regionHint} />}
        >
          <Field
            component={CloudRegionComboBox}
            name="region"
            cloudProviderID={cloudProviderID}
            disabled={pending}
            isRequired
            isMultiAz={isMultiAz}
            isBYOC={isBYOC}
            handleCloudRegionChange={handleCloudRegionChange}
          />
        </FormGroup>
      </GridItem>
      <GridItem md={6} />

      {/* Availability */}
      {showAvailability &&
        (isHypershiftSelected ? (
          <Alert
            isInline
            variant="info"
            title="The hosted control plane uses multiple availability zones."
          />
        ) : (
          <>
            <GridItem md={6}>
              <FormGroup label="Availability" isRequired isInline fieldId="availability-toggle">
                <Field
                  component={RadioButtons}
                  name="multi_az"
                  disabled={pending}
                  onChange={handleMultiAZChange}
                  options={[
                    {
                      value: 'false',
                      label: 'Single zone',
                      disabled: !hasSingleAzQuota,
                      tooltipText: singleAzTooltip,
                      extendedHelpText: constants.availabilityHintSingleZone,
                    },
                    {
                      value: 'true',
                      label: 'Multi-zone',
                      disabled: !hasMultiAzQuota,
                      tooltipText: multiAzTooltip,
                      extendedHelpText: constants.availabilityHintMultiZone,
                    },
                  ]}
                  defaultValue={hasSingleAzQuota ? 'false' : 'true'}
                  disableDefaultValueHandling={isWizard}
                />
              </FormGroup>
            </GridItem>
            <GridItem md={6} />
          </>
        ))}
    </>
  );
}

BasicFieldsSection.propTypes = {
  pending: PropTypes.bool,
  product: PropTypes.string.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  showAvailability: PropTypes.bool,
  change: PropTypes.func.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  hasSingleAzQuota: PropTypes.bool.isRequired,
  hasMultiAzQuota: PropTypes.bool.isRequired,
  isWizard: PropTypes.bool,
  isHypershiftSelected: PropTypes.bool,
  clusterPrivacy: PropTypes.string,
  hasDomainPrefix: PropTypes.bool,
};

export default BasicFieldsSection;
