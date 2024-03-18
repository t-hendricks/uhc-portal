import React from 'react';
import { FieldInputProps } from 'formik';

import { FormSelect, FormSelectOption, FormSelectProps } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { CloudRegion } from '~/types/clusters_mgmt.v1';
import { GlobalState } from '~/redux/store';
import {
  AWS_DEFAULT_REGION,
  GCP_DEFAULT_REGION,
} from '~/components/clusters/wizards/common/createOSDInitialValues';
import ErrorBox from '~/components/common/ErrorBox';
import { useFormState } from '~/components/clusters/wizards/hooks';

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
    const regionsData = cloudProviders?.providers?.[cloudProviderID]?.regions;
    const selectedRegionData = regionsData?.[field.value?.toString()];

    // TODO: only do this when isMultiAz!  us-west-1 is fine for Single AZ.
    //   Well it somehow works, I suspect due to incomplete dependency array?
    if (!selectedRegionData?.supports_multi_az) {
      const resetRegion = cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
      // Guard from infinite loop resetting to a region we don't [yet] have data on.
      if (regionsData?.[resetRegion]) {
        setFieldValue(field.name, resetRegion);
        handleCloudRegionChange?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMultiAz,
    cloudProviders,
    setFieldValue,
    field.name,
    cloudProviderID,
    handleCloudRegionChange,
  ]);

  if (cloudProviders.fulfilled) {
    return (
      <FormSelect
        name={field.name}
        className="cloud-region-combo-box"
        aria-label="Region"
        isDisabled={isDisabled}
        value={field.value}
        onChange={(_event, value) => {
          setFieldValue(field.name, value);
          handleCloudRegionChange?.();
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
