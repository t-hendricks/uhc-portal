import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { FormGroup, GridItem } from '@patternfly/react-core';
import CloudRegionComboBox from './CloudRegionComboBox';
import { constants } from '../../CreateOSDFormConstants';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import PopoverHint from '../../../../../common/PopoverHint';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ReduxRichInputField from '../../../../../common/ReduxFormComponents/ReduxRichInputField';
import validators, { clusterNameValidation } from '../../../../../../common/validators';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import { PLACEHOLDER_VALUE as AVAILABILITY_ZONE_PLACEHOLDER } from '../NetworkingSection/AvailabilityZoneSelection';
import VersionSelection from './VersionSelection';
import { getNodesCount, getMinReplicasCount } from '../ScaleSection/AutoScaleSection/AutoScaleHelper';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import { createOperatorRolesHashPrefix } from '../../../../CreateROSAPage/CreateROSAWizard/ClusterRolesScreen/ClusterRolesScreen';

function BasicFieldsSection({
  pending,
  showDNSBaseDomain,
  showAvailability,
  product,
  cloudProviderID,
  isBYOC,
  isMultiAz,
  hasSingleAzQuota,
  hasMultiAzQuota,
  change,
  isWizard,
  handleMultiAZChangeForOldForm,
}) {
  const multiAzTooltip = !hasMultiAzQuota && noQuotaTooltip;
  const singleAzTooltip = !hasSingleAzQuota && noQuotaTooltip;
  const isRosa = product === normalizedProducts.ROSA;

  const handleCloudRegionChange = () => {
    // Move the az selection form
    // to its default value once the cloudRegion selection
    // changes to avoid incorrect zone.
    const azCount = isMultiAz ? 3 : 1;
    for (let i = 0; i < azCount; i += 1) {
      change(`az_${i}`, AVAILABILITY_ZONE_PLACEHOLDER);
    }
  };

  const handleMultiAZChange = (_, value) => {
    // when multiAz changes, reset node count
    const isValueMultiAz = value === 'true';
    change('nodes_compute', getNodesCount(isBYOC, isValueMultiAz, true));
    change('min_replicas', getMinReplicasCount(isBYOC, isValueMultiAz, true));
    change('max_replicas', '');
    if (handleMultiAZChangeForOldForm) {
      handleMultiAZChangeForOldForm(value);
    }
  };

  const reduxFormsClusterNameValidate = value => (
    clusterNameValidation(value).find(validator => validator.validated === false)?.text
  );

  return (
    <>
      {/* cluster name */}
      <GridItem md={6}>
        <Field
          component={ReduxRichInputField}
          name="name"
          label="Cluster name"
          type="text"
          validate={reduxFormsClusterNameValidate}
          validation={clusterNameValidation}
          disabled={pending}
          isRequired
          extendedHelpText={constants.clusterNameHint}
          onChange={value => isRosa && change('custom_operator_roles_prefix', `${value}-${createOperatorRolesHashPrefix()}`)}
        />
      </GridItem>
      <GridItem md={6} />

      {/* Base DNS domain */}
      {showDNSBaseDomain && (
        <>
          <GridItem md={6}>
            <Field
              component={ReduxVerticalFormGroup}
              name="dns_base_domain"
              label="Base DNS domain"
              type="text"
              validate={validators.checkBaseDNSDomain}
              disabled={pending}
              normalize={value => value.toLowerCase()}
            />
          </GridItem>
          <GridItem md={6} />
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
            isRosa={isRosa}
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
      {showAvailability && (
        <>
          <GridItem md={6}>
            <FormGroup
              label="Availability"
              isRequired
              isInline
              fieldId="availability-toggle"
            >
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
                    label: 'Multi zone',
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
      )}
    </>
  );
}

BasicFieldsSection.propTypes = {
  pending: PropTypes.bool,
  product: PropTypes.string.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  showDNSBaseDomain: PropTypes.bool,
  showAvailability: PropTypes.bool,
  handleMultiAZChangeForOldForm: PropTypes.func,
  change: PropTypes.func.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  hasSingleAzQuota: PropTypes.bool.isRequired,
  hasMultiAzQuota: PropTypes.bool.isRequired,
  isWizard: PropTypes.bool,
};

export default BasicFieldsSection;
