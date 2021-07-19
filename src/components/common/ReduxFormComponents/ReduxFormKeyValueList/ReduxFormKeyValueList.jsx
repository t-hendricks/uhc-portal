import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { TextInput, Button } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

import { getRandomID } from '../../../../common/helpers';

import './ReduxFormKeyValueList.scss';

const LabelKey = ({ input, meta: { touched, error } }) => (
  <>
    <TextInput
      aria-label="Key-value list key"
      className="reduxFormKeyValueList-key"
      {...input}
    />
    {touched && error && <span>{error}</span>}
  </>
);

LabelKey.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

const LabelValue = ({ input, meta: { touched, error } }) => (
  <>
    <TextInput
      aria-label="Key-value list value"
      className="reduxFormKeyValueList-value"
      {...input}
    />
    {touched && error && <span>{error}</span>}
  </>
);

LabelValue.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

const ReduxFormKeyValueList = ({ fields, meta: { error, submitFailed } }) => (
  <div className="reduxFormKeyValueList">
    <div className="pf-c-form__label reduxFormKeyValueList-colTitles">
      <div className="reduxFormKeyValueList-title pf-c-form__label-text">Key</div>
      <div className="reduxFormKeyValueList-title reduxFormKeyValueList-title-value pf-c-form__label-text">Value</div>
    </div>
    {fields.map((label, index) => {
      const isRemoveDisabled = index === 0 && fields.length === 1;

      return (
        <div className="pf-u-mb-md" key={`${fields.get(index).id}`}>
          <Field
            name={`${label}.key`}
            type="text"
            component={LabelKey}
            index={index}
          />
          <Field
            name={`${label}.value`}
            type="text"
            component={LabelValue}
            index={index}
          />
          <Button
            onClick={() => fields.remove(index)}
            icon={<MinusCircleIcon />}
            variant="link"
            isDisabled={isRemoveDisabled}
            className={isRemoveDisabled ? 'reduxFormKeyValueList-removeBtn-disabled' : 'reduxFormKeyValueList-removeBtn'}
          />
        </div>
      );
    })}
    <Button
      onClick={() => fields.push({ id: getRandomID() })}
      icon={<PlusCircleIcon />}
      variant="link"
      className="reduxFormKeyValueList-addBtn"
    >
      Add label
    </Button>
    {submitFailed && error && <span>{error}</span>}
  </div>
);

ReduxFormKeyValueList.propTypes = {
  fields: PropTypes.array.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
};

export default ReduxFormKeyValueList;
