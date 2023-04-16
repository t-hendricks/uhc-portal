import React from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'formik';
import isEqual from 'lodash/isEqual';

import { GridItem } from '@patternfly/react-core';

import {
  required,
  validateAWSSubnet,
  validateAWSSubnetIsPrivate,
  validateAWSSubnetIsPublic,
  validateUniqueAZ,
  validateValueNotPlaceholder,
} from '~/common/validators';
import AvailabilityZoneSelection, {
  PLACEHOLDER_VALUE,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import { getAWSCloudProviderVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import ErrorBox from '~/components/common/ErrorBox';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { TextInputField } from '~/components/clusters/wizards/form';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { getAwsCcsCredentials } from '../../../common';

interface AwsSubnetFieldsProps {
  region: string;
  isMultiAz: boolean;
  usePrivateLink: boolean;
}

export const AwsSubnetFields = (props: AwsSubnetFieldsProps) => {
  const dispatch = useDispatch();
  const { values } = useFormState();
  const {
    [FieldId.CloudProvider]: cloudProvider,
    [FieldId.Region]: region,
    [FieldId.AccountId]: accountId,
    [FieldId.AccessKeyId]: accessKeyId,
    [FieldId.SecretAccessKey]: secretAccessKey,
    [FieldId.InstallerRoleArn]: installerRoleArn,
  } = values;
  const { isMultiAz } = props;
  const ccsCredentials = React.useMemo(
    () => getAwsCcsCredentials(values),
    [accountId, accessKeyId, secretAccessKey, installerRoleArn],
  );
  const vpcs = useGlobalState((state) => state.ccsInquiries.vpcs);

  React.useEffect(() => {
    if (cloudProvider === CloudProviderType.Aws) {
      dispatch(getAWSCloudProviderVPCs(ccsCredentials, region));
    }
  }, [ccsCredentials, cloudProvider, dispatch, region]);

  const vpcsValid = React.useMemo(() => {
    if (!vpcs.fulfilled) {
      return false;
    }

    return (
      vpcs.cloudProvider === cloudProvider &&
      isEqual(vpcs.credentials, ccsCredentials) &&
      vpcs.region === region
    );
  }, [
    ccsCredentials,
    cloudProvider,
    region,
    vpcs.cloudProvider,
    vpcs.credentials,
    vpcs.fulfilled,
    vpcs.region,
  ]);

  return (
    <>
      {vpcs.error && (
        <ErrorBox
          message="Failed to list existing VPCs, validations will be partial"
          response={vpcs}
        />
      )}
      <SingleSubnetFieldsRow showLabels index={0} vpcs={vpcs} vpcsValid={vpcsValid} {...props} />
      {isMultiAz && (
        <>
          <SingleSubnetFieldsRow index={1} vpcs={vpcs} vpcsValid={vpcsValid} {...props} />
          <SingleSubnetFieldsRow index={2} vpcs={vpcs} vpcsValid={vpcsValid} {...props} />
        </>
      )}
    </>
  );
};

interface SingleSubnetFieldsRowProps {
  region: string;
  index: number;
  isMultiAz: boolean;
  usePrivateLink: boolean;
  vpcs: any;
  vpcsValid: boolean;
  showLabels?: boolean;
}

const SingleSubnetFieldsRow = ({
  showLabels = false,
  index,
  region,
  isMultiAz,
  usePrivateLink,
  vpcs,
  vpcsValid,
}: SingleSubnetFieldsRowProps) => {
  const { values, getFieldProps, getFieldMeta, setFieldValue } = useFormState();
  const azFieldName = `az_${index}`;
  const privateSubnetIdName = `private_subnet_id_${index}`;
  const publicSubnetIdName = `public_subnet_id_${index}`;
  const vpcsData = { vpcs, vpcsValid };

  const validateAvailabilityZone = (value: string) =>
    required(value) ||
    (isMultiAz && validateUniqueAZ(value, values, null, azFieldName)) ||
    validateValueNotPlaceholder(PLACEHOLDER_VALUE)(value);

  const validatePrivateSubnet = (value: string) =>
    required(value) ||
    validateAWSSubnet(value, values, vpcsData, privateSubnetIdName) ||
    validateAWSSubnetIsPrivate(value, values, vpcsData);

  const validatePublicSubnet = (value: string) =>
    required(value) ||
    validateAWSSubnet(value, values, vpcsData, publicSubnetIdName) ||
    validateAWSSubnetIsPublic(value, values, vpcsData);

  return (
    <>
      <GridItem className="vpc-input-field" md={4}>
        <Field
          component={AvailabilityZoneSelection}
          name={azFieldName}
          label={showLabels ? 'Availability zone' : null}
          validate={validateAvailabilityZone}
          region={region}
          input={{
            ...getFieldProps(azFieldName),
            onChange: (value: string) => setFieldValue(azFieldName, value),
          }}
          meta={getFieldMeta(azFieldName)}
        />
      </GridItem>
      <GridItem md={4}>
        <TextInputField
          name={privateSubnetIdName}
          validate={validatePrivateSubnet}
          {...(showLabels && { label: 'Private subnet ID' })}
        />
      </GridItem>
      {!usePrivateLink && (
        <GridItem md={4}>
          <TextInputField
            name={publicSubnetIdName}
            validate={validatePublicSubnet}
            {...(showLabels && { label: 'Public subnet ID' })}
          />
        </GridItem>
      )}
      {usePrivateLink && <GridItem md={4} />}
    </>
  );
};
