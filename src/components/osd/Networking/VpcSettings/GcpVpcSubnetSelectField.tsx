import React from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';
import isEqual from 'lodash/isEqual';

import {
  Alert,
  FormGroup,
  FormSelect,
  FormSelectOption,
  FormSelectProps,
} from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { FieldId } from '../../constants';
import { useFormState } from '../../hooks';
import { getCcsCredentials } from '../../utils';

interface GcpVpcSubnetSelectFieldProps {
  input: FieldInputProps<FormSelectProps>;
  meta: FieldMetaProps<FormSelectProps>;
  placeholder: string;
  emptyPlaceholder: string;
  label: string;
  credentials: string;
  region: string;
  hasDependencies: boolean;
  matchesDependencies: boolean;
}

export const GcpVpcSubnetSelectField = ({
  input,
  meta,
  label,
  placeholder,
  emptyPlaceholder,
}: GcpVpcSubnetSelectFieldProps) => {
  const { vpcs } = useGlobalState((state) => state.ccsInquiries);
  const {
    values,
    values: { [FieldId.Region]: region, [FieldId.VpcName]: vpcName },
  } = useFormState();
  const ccsCredentials = getCcsCredentials(values);
  const hasDependencies = !!(ccsCredentials && region && vpcName);
  const matchesDependencies =
    vpcs.cloudProvider === 'gcp' &&
    isEqual(vpcs.credentials, ccsCredentials) &&
    vpcs.region === region;
  const showOptions = matchesDependencies && vpcs.fulfilled;
  const items = React.useMemo(() => {
    const selectedVPC = vpcs?.data?.items?.find(
      (item: { name: string; subnets: string[] }) => item.name === vpcName,
    ) as unknown as { name: string; subnets: string[] };
    return selectedVPC?.subnets || [];
  }, [vpcName, vpcs?.data?.items]);

  const isCurrentValueIrrelevant = React.useMemo(() => {
    if (!input.value) {
      // Blank/placeholder always legitimate.
      return false;
    }
    if (!hasDependencies) {
      // Can't make request.
      return true;
    }
    if (matchesDependencies && vpcs.fulfilled) {
      // Made request and current value is no longer valid.

      return !items.some((item: string) => item === input.value.toString());
    }
    return false;
  }, [hasDependencies, input.value, items, matchesDependencies, vpcs.fulfilled]);

  React.useEffect(() => {
    if (isCurrentValueIrrelevant) {
      input.onChange('');
    }
  }, [input, isCurrentValueIrrelevant]);

  const selectOptions = React.useMemo(() => {
    let options: React.ReactNode;

    if (showOptions) {
      if (items.length > 0) {
        options = (
          <>
            <FormSelectOption isDisabled isPlaceholder value="" label={placeholder} />
            {items.map((item) => (
              <FormSelectOption key={item} value={item} label={item} />
            ))}
          </>
        );
      } else {
        options = <FormSelectOption isDisabled isPlaceholder value="" label={emptyPlaceholder} />;
      }
    } else if (vpcs.pending) {
      options = <FormSelectOption isDisabled value="" label="Loading..." />;
    } else {
      options = <FormSelectOption isDisabled value="" label="" />;
    }

    return options;
  }, [emptyPlaceholder, items, placeholder, showOptions, vpcs.pending]);

  return (
    <FormGroup
      label={label}
      validated={meta.touched && meta.error ? 'error' : 'default'}
      helperTextInvalid={meta.error}
      fieldId={input.name}
    >
      {matchesDependencies && vpcs.error && (
        <Alert
          variant="danger"
          isInline
          title="Failed to list existing VPC subnets using your GCP credentials"
        >
          Verify that your entered service account details are correct
        </Alert>
      )}
      <FormSelect aria-label={label} isDisabled={!(showOptions && items.length > 0)} {...input}>
        {selectOptions}
      </FormSelect>
    </FormGroup>
  );
};
