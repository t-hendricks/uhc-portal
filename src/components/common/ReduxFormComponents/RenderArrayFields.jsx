import React from 'react';
import { PropTypes } from 'prop-types';
import { Field } from 'redux-form';
import pullAt from 'lodash/pullAt';
import { Button, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';
import ReduxVerticalFormGroup from './ReduxVerticalFormGroup';
import { getRandomID } from '../../../common/helpers';
import ButtonWithTooltip from '../ButtonWithTooltip';

import './RenderArrayFields.scss';

const LabelGridItem = ({ fieldSpan, label, isRequired, helpText }) => (
  <GridItem className="field-array-title" span={fieldSpan}>
    <p className="pf-c-form__label-text" id="field-array-label">
      {label}
      {isRequired ? <span className="pf-c-form__label-required">*</span> : null}
    </p>
    {helpText ? (
      <p className="pf-c-form__helper-text" id="field-array-help-text">
        {helpText}
      </p>
    ) : null}
  </GridItem>
);

LabelGridItem.propTypes = {
  fieldSpan: PropTypes.number.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  helpText: PropTypes.string,
};

const AddMoreButtonGridItem = ({ addNewField, areFieldsFilled }) => {
  const isDisabled = !areFieldsFilled.length || areFieldsFilled.includes(false);

  return (
    <GridItem className="field-grid-item">
      <Button
        onClick={addNewField}
        icon={<PlusCircleIcon />}
        variant="link"
        isDisabled={isDisabled}
      >
        Add more
      </Button>
    </GridItem>
  );
};

AddMoreButtonGridItem.propTypes = {
  addNewField: PropTypes.func.isRequired,
  areFieldsFilled: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

const FieldArrayErrorGridItem = ({ isLast, errorMessage, touched, isGroupError }) => {
  if (errorMessage && isLast && (touched || isGroupError)) {
    return (
      <GridItem className="field-grid-item pf-c-form__helper-text pf-m-error">
        {errorMessage}
      </GridItem>
    );
  }
  return null;
};

FieldArrayErrorGridItem.propTypes = {
  isLast: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  touched: PropTypes.bool,
  isGroupError: PropTypes.bool,
};

const MinusButtonGridItem = ({ index, fields, onClick }) => {
  const isOnlyItem = index === 0 && fields.length === 1;
  return (
    <GridItem className="field-grid-item minus-button" span={1}>
      <ButtonWithTooltip
        disableReason={isOnlyItem && 'You cannot delete the only item'}
        tooltipProps={{ position: 'right', distance: 0 }}
        onClick={onClick}
        icon={<MinusCircleIcon />}
        variant="link"
      />
    </GridItem>
  );
};

MinusButtonGridItem.propTypes = {
  index: PropTypes.number.isRequired,
  fields: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

const FieldGridItem = ({
  item,
  index,
  fields,
  fieldSpan,
  fieldName,
  placeholderText,
  validateField,
  disabled,
  onFieldChange,
  setTouched,
}) => {
  const { id } = fields.get(index);
  return (
    <GridItem className="field-grid-item" span={fieldSpan}>
      <Field
        key={id}
        component={ReduxVerticalFormGroup}
        name={`${item}.${fieldName}`}
        type="text"
        placeholder={`${placeholderText} ${index + 1}`}
        validate={validateField}
        disabled={disabled}
        onChange={(e, value) => onFieldChange(e, value, index)}
        onBlur={() => {
          setTouched(true);
        }}
      />
    </GridItem>
  );
};

FieldGridItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.array.isRequired,
  fieldSpan: PropTypes.number,
  fieldName: PropTypes.string,
  placeholderText: PropTypes.string,

  validateField: PropTypes.func,
  disabled: PropTypes.bool,
  onFieldChange: PropTypes.func,
  setTouched: PropTypes.func.isRequired,
};

const RenderArrayFields = (props) => {
  const {
    fields,
    label,
    helpText,
    isRequired,
    onFormChange,
    fieldSpan = 8,
    isGroupError,
    meta: { error, submitFailed },
    FieldGridItemComponent = FieldGridItem,
  } = props;

  const [touched, setTouched] = React.useState(false);
  const [areFieldsFilled, setAreFieldsFilled] = React.useState([]);

  React.useEffect(() => {
    if (submitFailed) {
      setTouched(true);
    }
  }, [submitFailed]);

  React.useEffect(
    () => {
      if (fields.length === 0) {
        addNewField();
      } else {
        // fields on mount = default values, populate internal state to account for them
        setAreFieldsFilled(fields.map((field) => !!field));
      }
    },
    [
      /* Call once */
    ],
  );

  const onFieldChange = (e, value, index) => {
    if (!touched) {
      setTouched(true);
    }
    if (onFormChange) {
      onFormChange(e, value);
    }
    setAreFieldsFilled((areFieldsFilled) => {
      const newFilledStatus = [...areFieldsFilled];
      newFilledStatus[index] = !!value;
      return newFilledStatus;
    });
  };

  const removeField = (index) => {
    fields.remove(index);
    setAreFieldsFilled((areFieldsFilled) => {
      const newFilledStatus = [...areFieldsFilled];
      pullAt(newFilledStatus, index);
      return newFilledStatus;
    });
  };

  const addNewField = () => {
    fields.insert(0, { id: getRandomID() });
    setAreFieldsFilled((areFieldsFilled) => {
      const newFilledStatus = [false, ...areFieldsFilled];
      return newFilledStatus;
    });
  };

  return (
    <>
      <LabelGridItem
        fieldSpan={fieldSpan}
        label={`${label} (${fields.length})`}
        isRequired={isRequired}
        helpText={helpText}
      />
      <AddMoreButtonGridItem addNewField={addNewField} areFieldsFilled={areFieldsFilled} />
      {fields.map((item, index) => (
        <React.Fragment key={`${fields.get(index).id}`}>
          <FieldGridItemComponent
            item={item}
            index={index}
            onFieldChange={onFieldChange}
            setTouched={setTouched}
            fieldSpan={fieldSpan}
            {...props}
          />
          <MinusButtonGridItem index={index} fields={fields} onClick={() => removeField(index)} />
          <FieldArrayErrorGridItem
            isLast={index === fields.length - 1}
            errorMessage={error}
            touched={touched}
            isGroupError={isGroupError}
          />
        </React.Fragment>
      ))}
    </>
  );
};

RenderArrayFields.propTypes = {
  fields: PropTypes.array.isRequired,
  label: PropTypes.string,
  helpText: PropTypes.string,
  isRequired: PropTypes.bool,
  onFormChange: PropTypes.func.isRequired,
  fieldSpan: PropTypes.number,
  isGroupError: PropTypes.bool,
  meta: PropTypes.shape({ error: PropTypes.string, submitFailed: PropTypes.bool }),
  FieldGridItemComponent: PropTypes.func,
};

export default RenderArrayFields;
