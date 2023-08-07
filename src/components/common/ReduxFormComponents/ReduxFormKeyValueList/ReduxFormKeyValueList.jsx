import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';
import ButtonWithTooltip from '../../ButtonWithTooltip';

import { getRandomID, nodeKeyValueTooltipText } from '../../../../common/helpers';
import { validateLabelKey, validateLabelValue } from '../../../../common/validators';

import './ReduxFormKeyValueList.scss';

const LabelKey = ({ input, meta: { touched, error } }) => (
  <>
    <TextInput
      aria-label="Key-value list key"
      validated={!(touched && error) ? 'default' : 'error'}
      {...input}
    />
    {touched && error && <span className="pf-c-form__helper-text pf-m-error">{error}</span>}
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
      validated={!(touched && error) ? 'default' : 'error'}
      {...input}
    />
    {touched && error && <span className="pf-c-form__helper-text pf-m-error">{error}</span>}
  </>
);

LabelValue.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

const hasOnlyValidKeys = (fieldsArray) => fieldsArray && !fieldsArray.every((field) => field.key);
const ReduxFormKeyValueList = ({ fields, meta: { error, submitFailed } }) => (
  <Grid hasGutter>
    <GridItem span={4} className="pf-c-form__label pf-c-form__label-text">
      Key
    </GridItem>
    <GridItem span={4} className="pf-c-form__label pf-c-form__label-text">
      Value
    </GridItem>
    <GridItem span={4} />
    {fields.map((label, index) => {
      const isRemoveDisabled = index === 0 && fields.length === 1;

      return (
        <React.Fragment key={`${fields.get(index).id}`}>
          <GridItem span={4}>
            <Field
              name={`${label}.key`}
              type="text"
              component={LabelKey}
              index={index}
              validate={validateLabelKey}
            />
          </GridItem>
          <GridItem span={4}>
            <Field
              name={`${label}.value`}
              type="text"
              component={LabelValue}
              index={index}
              validate={validateLabelValue}
            />
          </GridItem>
          <GridItem span={4}>
            <Button
              onClick={() => fields.remove(index)}
              icon={<MinusCircleIcon />}
              variant="link"
              isDisabled={isRemoveDisabled}
              className={
                isRemoveDisabled
                  ? 'reduxFormKeyValueList-removeBtn-disabled'
                  : 'reduxFormKeyValueList-removeBtn'
              }
            />
          </GridItem>
        </React.Fragment>
      );
    })}
    <GridItem>
      <ButtonWithTooltip
        onClick={() => fields.push({ id: getRandomID() })}
        icon={<PlusCircleIcon />}
        variant="link"
        isInline
        className="reduxFormKeyValueList-addBtn"
        // .getAll() is a redux-form method that takes the field values and puts them in an array
        disableReason={hasOnlyValidKeys(fields.getAll()) && nodeKeyValueTooltipText}
      >
        Add additional label
      </ButtonWithTooltip>
      {submitFailed && error && <span>{error}</span>}
    </GridItem>
  </Grid>
);

ReduxFormKeyValueList.propTypes = {
  fields: PropTypes.array.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
};

export default ReduxFormKeyValueList;
