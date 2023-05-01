import React from 'react';
import { FieldArray } from 'redux-form';
import RenderArrayFields from './RenderArrayFields';

function ReduxFieldArray(props) {
  const { fieldName } = props;
  const fieldArray = <FieldArray name={fieldName} component={RenderArrayFields} {...props} />;
  return fieldArray;
}

export default ReduxFieldArray;
