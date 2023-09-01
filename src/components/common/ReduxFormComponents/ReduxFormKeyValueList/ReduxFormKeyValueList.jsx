/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';
import ButtonWithTooltip from '../../ButtonWithTooltip';

import { getRandomID, nodeKeyValueTooltipText } from '../../../../common/helpers';
import { validateLabelKey, validateLabelValue } from '../../../../common/validators';

import './ReduxFormKeyValueList.scss';

const LabelKey = ({ isNextClicked, input, meta: { touched, error } }) => (
  <>
    <TextInput
      aria-label="Key-value list key"
      validated={(touched && error) || (isNextClicked && error) ? 'error' : 'default'}
      {...input}
    />
    {console.log('clicked in keyval list: ', isNextClicked)}
    {console.log('error? ', error)}
    {((touched && error) || (isNextClicked && error)) && (
      <span className="pf-c-form__helper-text pf-m-error">{error}</span>
    )}
  </>
);

LabelKey.propTypes = {
  touch: PropTypes.func,
  isNextClicked: PropTypes.bool,
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

const LabelValue = ({ isNextClicked, input, meta: { touched, error } }) => (
  <>
    <TextInput
      aria-label="Key-value list value"
      validated={(touched && error) || (isNextClicked && error) ? 'error' : 'default'}
      {...input}
    />
    {((touched && error) || (isNextClicked && error)) && (
      <span className="pf-c-form__helper-text pf-m-error">{error}</span>
    )}
  </>
);

LabelValue.propTypes = {
  isNextClicked: PropTypes.bool,
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

const hasInvalidKeys = (fieldsArray) => fieldsArray && fieldsArray.some((field) => !field.key);
const ReduxFormKeyValueList = ({ fields, isNextClicked }) => (
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
              isNextClicked={isNextClicked}
            />
          </GridItem>
          <GridItem span={4}>
            <Field
              name={`${label}.value`}
              type="text"
              component={LabelValue}
              index={index}
              validate={validateLabelValue}
              isNextClicked={isNextClicked}
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
        disableReason={hasInvalidKeys(fields.getAll()) && nodeKeyValueTooltipText}
      >
        Add additional label
      </ButtonWithTooltip>
    </GridItem>
  </Grid>
);

ReduxFormKeyValueList.propTypes = {
  isNextClicked: PropTypes.bool,
  fields: PropTypes.array.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
  }),
};

export default ReduxFormKeyValueList;
