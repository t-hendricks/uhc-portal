import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';
import CloudRegionComboBox from './CloudRegionComboBox';
import { constants } from '../../CreateOSDFormConstants';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import PopoverHint from '../../../../../common/PopoverHint';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../../common/validators';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import { PLACEHOLDER_VALUE as AVAILABILITY_ZONE_PLACEHOLDER } from '../NetworkingSection/AvailabilityZoneSelection';

function BasicFieldsSection({
  pending,
  showDNSBaseDomain,
  showAvailability,
  cloudProviderID,
  isBYOC,
  isMultiAz,
  hasSingleAzQuota,
  hasMultiAzQuota,
  handleMultiAZChange,
  change,
}) {
  const multiAzTooltip = !hasMultiAzQuota && noQuotaTooltip;
  const singleAzTooltip = !hasSingleAzQuota && noQuotaTooltip;

  const handleCloudRegionChange = () => {
    // Move the az selection form
    // to its default value once the cloudRegion selection
    // changes to avoid incorrect zone.
    const azCount = isMultiAz ? 3 : 1;
    for (let i = 0; i < azCount; i += 1) {
      change(`az_${i}`, AVAILABILITY_ZONE_PLACEHOLDER);
    }
  };

  return (
    <>
      {/* cluster name */}
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="name"
          label="Cluster name"
          type="text"
          validate={validators.checkClusterName}
          disabled={pending}
          isRequired
          extendedHelpText={constants.clusterNameHint}
        />
      </GridItem>
      <GridItem span={8} />

      {/* Base DNS domain */}
      {showDNSBaseDomain && (
        <>
          <GridItem span={4}>
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
          <GridItem span={8} />
        </>
      )}

      {/* Region */}
      <GridItem span={4}>
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
      <GridItem span={8} />

      {/* Availability */}
      {showAvailability && (
        <>
          <GridItem span={4}>
            <FormGroup
              label="Availability"
              isRequired
              fieldId="availability-toggle"
              labelIcon={<PopoverHint hint={constants.availabilityHint} />}
            >
              <Field
                component={RadioButtons}
                className={!hasSingleAzQuota || !hasMultiAzQuota ? 'radio-az-disabled' : null}
                name="multi_az"
                disabled={pending}
                onChange={handleMultiAZChange}
                options={[
                  {
                    value: 'false',
                    label: 'Single zone',
                    disabled: !hasSingleAzQuota,
                    tooltipText: singleAzTooltip,
                  },
                  {
                    value: 'true',
                    label: 'Multizone',
                    disabled: !hasMultiAzQuota,
                    tooltipText: multiAzTooltip,
                  },
                ]}
                defaultValue={hasSingleAzQuota ? 'false' : 'true'}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={8} />
        </>
      )}
    </>
  );
}

BasicFieldsSection.propTypes = {
  pending: PropTypes.bool,
  isMultiAz: PropTypes.bool.isRequired,
  showDNSBaseDomain: PropTypes.bool,
  showAvailability: PropTypes.bool,
  handleMultiAZChange: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  hasSingleAzQuota: PropTypes.bool.isRequired,
  hasMultiAzQuota: PropTypes.bool.isRequired,
};

export default BasicFieldsSection;
