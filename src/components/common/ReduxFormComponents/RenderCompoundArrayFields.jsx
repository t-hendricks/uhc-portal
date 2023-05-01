import React from 'react';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';
import ReduxVerticalFormGroup from './ReduxVerticalFormGroup';
import RenderArrayFields from './RenderArrayFields';

const CompoundFieldGridItem = ({
  item,
  index,
  fields,
  fieldSpan,
  compoundFields,
  disabled,
  onFieldChange,
  setTouched,
}) => {
  const { id } = fields.get(index);
  const compoundFieldSpan = Math.max(Math.floor(fieldSpan / compoundFields.length), 1);

  return (
    <>
      {compoundFields.map((compoundField) => {
        const compoundFieldId = `${id}-${compoundField.name}`;

        return (
          <GridItem className="field-grid-item" span={compoundFieldSpan} key={compoundFieldId}>
            <Field
              component={ReduxVerticalFormGroup}
              {...compoundField}
              name={`${item}.${compoundField.name}`}
              type={compoundField.type || 'text'}
              disabled={disabled}
              placeholder={
                compoundField.getPlaceholderText
                  ? compoundField.getPlaceholderText(index)
                  : undefined
              }
              helpText={
                compoundField.helpText ||
                (compoundField.getHelpText && compoundField.getHelpText(index)) ||
                undefined
              }
              onChange={(e, value) => onFieldChange(e, value, index)}
              onBlur={() => {
                setTouched(true);
              }}
            />
          </GridItem>
        );
      })}
    </>
  );
};

const RenderCompoundFields = (props) => {
  return <RenderArrayFields {...props} FieldGridItemComponent={CompoundFieldGridItem} />;
};

export default RenderCompoundFields;
