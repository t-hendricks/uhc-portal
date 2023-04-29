import React from 'react';
import { FieldArray } from 'redux-form';
import RenderArraySingleFields from './RenderArraySingleFields';

function ReduxFieldArray(props) {
  const { fieldName } = props;
  const fieldArray = <FieldArray name={fieldName} component={RenderArraySingleFields} {...props} />;
  return fieldArray;
}

export default ReduxFieldArray;
