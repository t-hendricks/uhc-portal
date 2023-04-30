import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import pullAt from 'lodash/pullAt';
import { GridItem } from '@patternfly/react-core';
import ReduxVerticalFormGroup from './ReduxVerticalFormGroup';
import { getRandomID } from '../../../common/helpers';
import {
  AddMoreButtonGridItem,
  FieldArrayErrorGridItem,
  LabelGridItem,
  MinusButtonGridItem,
} from './RenderArraySingleFields';

class RenderCompoundFields extends React.Component {
  state = { areFieldsFilled: [], touched: false };

  componentDidMount() {
    const {
      fields,
      meta: { submitFailed },
    } = this.props;
    if (submitFailed) {
      this.setState({ touched: true });
    }
    if (fields.length === 0) {
      this.addNewField();
    } else {
      // fields on mount = default values, populate internal state to account for them
      this.setState({ areFieldsFilled: fields.map((field) => !!field) });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      meta: { submitFailed },
    } = this.props;
    const prevSubmitFailed = prevProps.meta.submitFailed;
    // Make sure that the field array is set as touched when form is submitted and it's invalid
    if (submitFailed && !prevSubmitFailed) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ touched: true });
    }
  }

  onFieldChange(e, value, index) {
    const { onFormChange } = this.props;
    const { touched } = this.state;
    if (!touched) {
      this.setState({ touched: true });
    }
    if (onFormChange) {
      onFormChange(e, value);
    }
    this.setState(({ areFieldsFilled }) => {
      const newFilledStatus = [...areFieldsFilled];
      newFilledStatus[index] = !!value;
      return { areFieldsFilled: newFilledStatus };
    });
  }

  removeField = (index) => {
    const { fields } = this.props;
    fields.remove(index);
    this.setState(({ areFieldsFilled }) => {
      const newFilledStatus = [...areFieldsFilled];
      pullAt(newFilledStatus, index);
      return { areFieldsFilled: newFilledStatus };
    });
  };

  addNewField = () => {
    const { fields } = this.props;
    fields.push({ id: getRandomID() });
    this.setState(({ areFieldsFilled }) => {
      const newFilledStatus = [...areFieldsFilled];
      newFilledStatus.push(false);
      return { areFieldsFilled: newFilledStatus };
    });
  };

  render() {
    const {
      fields,
      compoundFields,
      label,
      helpText,
      isRequired,
      disabled,
      fieldSpan = 11,
      meta: { error },
    } = this.props;

    const { areFieldsFilled } = this.state;

    const fieldGridItem = (item, index) => {
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
                  onChange={(e, value) => this.onFieldChange(e, value, index)}
                  onBlur={() => {
                    const { touched } = this.state;
                    if (!touched) {
                      this.setState({ touched: true });
                    }
                  }}
                />
              </GridItem>
            );
          })}
        </>
      );
    };

    return (
      <>
        {fields.map((item, index) => (
          <React.Fragment key={`${fields.get(index).id}`}>
            <LabelGridItem
              index={index}
              fieldSpan={fieldSpan}
              label={label}
              isRequired={isRequired}
              helpText={helpText}
            />
            {fieldGridItem(item, index)}
            <MinusButtonGridItem
              index={index}
              fields={fields}
              onClick={() => this.removeField(index)}
            />
            <FieldArrayErrorGridItem
              index={index}
              errorMessage={error}
              touched={this.state.touched}
              isGroupError={this.props.isGroupError}
            />
            <AddMoreButtonGridItem
              index={index}
              fields={fields}
              addNewField={this.addNewField}
              areFieldsFilled={areFieldsFilled}
            />
          </React.Fragment>
        ))}
      </>
    );
  }
}

RenderCompoundFields.propTypes = {
  compoundFields: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  fieldSpan: PropTypes.number,
  /**
   * This prop is an onChange function that comes from the parent component.
   * It has to do with upper level changes that need to occur in the form
   * upon a change inside the fieldArray.
   */
  onFormChange: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
  isGroupError: PropTypes.bool,
};

export default RenderCompoundFields;
