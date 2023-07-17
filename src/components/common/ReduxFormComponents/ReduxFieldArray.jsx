import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import RenderArrayFields from './RenderArrayFields';

function ReduxFieldArray(props) {
  const { fieldName } = props;
  const fieldArray = <FieldArray name={fieldName} component={RenderArrayFields} {...props} />;
  return fieldArray;
}

ReduxFieldArray.propTypes = {
  fieldName: PropTypes.string,
};

export default ReduxFieldArray;
