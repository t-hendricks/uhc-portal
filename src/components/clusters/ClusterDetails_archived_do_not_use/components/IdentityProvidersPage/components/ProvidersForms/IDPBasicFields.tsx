import React from 'react';
import { Field } from 'redux-form';

import { GridItem } from '@patternfly/react-core';

import { required } from '../../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

export type IDPBasicFieldsProps = {
  isPending?: boolean;
};

const IDPBasicFields = ({ isPending = false }: IDPBasicFieldsProps) => (
  <>
    <GridItem span={8}>
      {/* @ts-ignore */}
      <Field
        component={ReduxVerticalFormGroup}
        name="client_id"
        label="Client ID"
        type="text"
        validate={required}
        isRequired
        disabled={isPending}
      />
    </GridItem>
    <GridItem span={8}>
      {/* @ts-ignore */}
      <Field
        component={ReduxVerticalFormGroup}
        name="client_secret"
        label="Client secret"
        type="password"
        validate={required}
        isRequired
        disabled={isPending}
      />
    </GridItem>
  </>
);

export default IDPBasicFields;
