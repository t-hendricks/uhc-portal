import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldInputProps, FieldMetaProps } from 'formik';
import isEqual from 'lodash/isEqual';

import {
  Alert,
  FormGroup,
  FormSelect,
  FormSelectOption,
  FormSelectProps,
} from '@patternfly/react-core';

import {
  getGCPCloudProviderVPCs,
  LIST_VPCS,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { getGcpCcsCredentials } from '~/components/clusters/wizards/common/utils/ccsCredentials';
import { CloudVPC } from '~/types/clusters_mgmt.v1';

interface GcpVpcNameSelectFieldProps {
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

export const GcpVpcNameSelectField = ({
  input,
  placeholder,
  emptyPlaceholder,
  label,
  meta,
}: GcpVpcNameSelectFieldProps) => {
  const dispatch = useDispatch();
  const { values } = useFormState();
  const { vpcs } = useGlobalState((state) => state.ccsInquiries);
  const ccsCredentials = getGcpCcsCredentials(values);
  const region = values[FieldId.Region];
  const hasDependencies = !!(ccsCredentials && region);
  const matchesDependencies =
    vpcs.cloudProvider === CloudProviderType.Gcp &&
    isEqual(vpcs.credentials, ccsCredentials) &&
    vpcs.region === region;
  const showOptions = matchesDependencies && vpcs.fulfilled;
  const items = React.useMemo(() => vpcs?.data?.items || [], [vpcs?.data?.items]);

  const selectOptions = React.useMemo(() => {
    let options: React.ReactNode;

    if (showOptions) {
      if (items.length > 0) {
        options = (
          <>
            <FormSelectOption isDisabled isPlaceholder value="" label={placeholder} />
            {items.map(({ name }) => (
              <FormSelectOption key={name} value={name} label={name || ''} />
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
  }, [showOptions, vpcs.pending, items, placeholder, emptyPlaceholder]);

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
      const items: CloudVPC[] = vpcs.data?.items || [];
      return !items.some((item) => item.name === input.value.toString());
    }

    return false;
  }, [hasDependencies, input.value, matchesDependencies, vpcs.data?.items, vpcs.fulfilled]);

  React.useEffect(() => {
    if (hasDependencies && !matchesDependencies && !vpcs.pending) {
      dispatch(getGCPCloudProviderVPCs(LIST_VPCS, ccsCredentials, region));
    }

    if (isCurrentValueIrrelevant) {
      input.onChange('');
    }
  }, [
    input,
    hasDependencies,
    matchesDependencies,
    vpcs.pending,
    ccsCredentials,
    region,
    dispatch,
    isCurrentValueIrrelevant,
  ]);

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
          title="Failed to list existing VPCs using your GCP credentials"
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
