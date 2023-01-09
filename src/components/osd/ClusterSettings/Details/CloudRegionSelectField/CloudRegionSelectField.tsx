import React from 'react';
import { FieldInputProps } from 'formik';

import { FormSelect, FormSelectOption, FormSelectProps } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import ErrorBox from '~/components/common/ErrorBox';
import { useFormState } from '~/components/osd/hooks';
import { CloudRegion } from '~/types/clusters_mgmt.v1';
import { GlobalState } from '~/redux/store';

interface CloudRegionSelectFieldProps {
  field: FieldInputProps<FormSelectProps>;
  cloudProviderID: string;
  availableRegions: CloudRegion[];
  cloudProviders: GlobalState['cloudProviders'];
  isMultiAz?: boolean;
  isDisabled?: boolean;
  handleCloudRegionChange?(): void;
}

export const CloudRegionSelectField = ({
  field,
  isMultiAz,
  cloudProviderID,
  cloudProviders,
  availableRegions,
  isDisabled,
  handleCloudRegionChange,
}: CloudRegionSelectFieldProps) => {
  const { setFieldValue } = useFormState();

  React.useEffect(() => {
    const selectedRegionData =
      cloudProviders?.providers?.[cloudProviderID]?.regions?.[field.value?.toString()];

    if (!selectedRegionData?.supports_multi_az) {
      setFieldValue(field.name, cloudProviderID === 'aws' ? 'us-east-1' : 'us-east1');
    }
  }, [isMultiAz, cloudProviders, setFieldValue, field.name, cloudProviderID]);

  if (cloudProviders.fulfilled) {
    return (
      <FormSelect
        name={field.name}
        className="cloud-region-combo-box"
        aria-label="Region"
        isDisabled={isDisabled}
        value={field.value}
        onChange={(value) => {
          handleCloudRegionChange?.();
          setFieldValue(field.name, value);
        }}
      >
        {availableRegions.map((region) => (
          <FormSelectOption
            key={region.id}
            value={region.id}
            label={`${region.id}, ${region.display_name}`}
            isDisabled={isMultiAz && !region.supports_multi_az}
          />
        ))}
      </FormSelect>
    );
  }

  return cloudProviders.error ? (
    <ErrorBox message="Error loading region list" response={cloudProviders} />
  ) : (
    <>
      <div className="spinner-fit-container">
        <Spinner />
      </div>
      <div className="spinner-loading-text">Loading region list...</div>
    </>
  );
};
