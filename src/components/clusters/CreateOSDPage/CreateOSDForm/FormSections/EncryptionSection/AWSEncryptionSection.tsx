import React from 'react';
import { GridItem, Alert } from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ExternalLink from '../../../../../common/ExternalLink';
import { validateAWSKMSKeyARN } from '../../../../../../common/validators';
import { constants } from '../../CreateOSDFormConstants';

interface Props {
  region: string;
}

const AWSCustomerManagedEncryption = ({ region }: Props) => (
  <>
    <GridItem md={6}>
      <Field
        component={ReduxVerticalFormGroup}
        name="kms_key_arn"
        type="text"
        label="Key ARN"
        placeholder="Key ARN"
        validate={(value: string) => validateAWSKMSKeyARN(value, region)}
        isRequired
        helpText="Unique, fully qualified identifier (Amazon Resource Name (ARN)) for your KMS Key."
        extendedHelpText={
          <>
            <p className="pf-u-mb-sm">{constants.awsKeyARN}</p>
            <ExternalLink href="https://docs.aws.amazon.com/kms/latest/developerguide/find-cmk-id-arn.html">
              Finding the key ID and ARN
            </ExternalLink>
          </>
        }
        showHelpTextOnError={false}
      />
    </GridItem>
    <GridItem md={6}>
      <Alert
        className="key-arn-alert"
        isInline
        isLiveRegion
        variant="info"
        title="If you delete the ARN key, the cluster will no longer be available."
      />
    </GridItem>
    <GridItem md={6} />
  </>
);

export default AWSCustomerManagedEncryption;
