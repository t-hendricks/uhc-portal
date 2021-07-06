import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import pullAt from 'lodash/pullAt';
import last from 'lodash/last';
import {
  Button,
  GridItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  PlusCircleIcon,
  MinusCircleIcon,
} from '@patternfly/react-icons';
import ReduxVerticalFormGroup from './ReduxVerticalFormGroup';
import { getRandomID } from '../../../common/helpers';
import './ReduxFieldArray.scss';

class RenderFields extends React.Component {
  state = { areFieldsFilled: [], touched: false };

  componentDidMount() {
    const { fields, meta: { submitFailed } } = this.props;
    if (submitFailed) {
      this.setState({ touched: true });
    }
    if (fields.length === 0) {
      this.addNewField();
    } else {
      // fields on mount = default values, populate internal state to account for them
      this.setState({ areFieldsFilled: fields.map(field => !!field) });
    }
  }

  componentDidUpdate(prevProps) {
    const { meta: { submitFailed } } = this.props;
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
  }

  addNewField = () => {
    const { fields } = this.props;
    fields.push({ id: getRandomID() });
    this.setState(({ areFieldsFilled }) => {
      const newFilledStatus = [...areFieldsFilled];
      newFilledStatus.push(false);
      return { areFieldsFilled: newFilledStatus };
    });
  }

  render() {
    const {
      fields,
      fieldName,
      label,
      helpText,
      isRequired,
      disabled,
      validateField,
      placeholderText,
      fieldSpan = 8,
      meta: { error },
    } = this.props;

    const labelGridItem = (index) => {
      if (index === 0) {
        return (
          <GridItem className="field-array-title" span={fieldSpan}>
            <p className="pf-c-form__label-text" id="field-array-label">
              {label}
              {
                isRequired
                  ? <span className="pf-c-form__label-required">*</span>
                  : null
              }
            </p>
            {
              helpText
                ? <p className="pf-c-form__helper-text" id="field-array-help-text">{helpText}</p>
                : null
            }
          </GridItem>
        );
      }
      return null;
    };

    const fieldGridItem = (item, index) => {
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
    };

    const { areFieldsFilled } = this.state;

    const addMoreButtonGridItem = (index) => {
      if (index === fields.length - 1) {
        return (
          <GridItem className="field-grid-item">
            <Button
              onClick={this.addNewField}
              icon={<PlusCircleIcon />}
              variant="link"
              isDisabled={!last(areFieldsFilled)} // disabled if last field is empty
            >
              Add more
            </Button>
          </GridItem>
        );
      }
      return null;
    };

    const fieldArrayErrorGridItem = (index, errorMessage) => {
      const { touched } = this.state;
      const { isGroupError } = this.props;
      if (errorMessage && index === 0 && (touched || isGroupError)) {
        return (
          <GridItem className="field-grid-item pf-c-form__helper-text pf-m-error">{errorMessage}</GridItem>
        );
      }
      return null;
    };

    const minusButtonGridItem = (index) => {
      const isDisabled = index === 0 && fields.length === 1;
      const minusButton = (
        <GridItem className="field-grid-item minus-button" span={1}>
          <Button
            onClick={() => this.removeField(index)}
            isDisabled={isDisabled}
            icon={<MinusCircleIcon />}
            variant="link"
          />
        </GridItem>
      );
      if (isDisabled) {
        return (
          <Tooltip
            content="You cannot delete the only item"
            position="right"
            distance={0}
          >
            {minusButton}
          </Tooltip>
        );
      } return minusButton;
    };

    return (
      <>
        {
        fields.map((item, index) => (
          <React.Fragment key={`${fields.get(index).id}`}>
            {labelGridItem(index)}
            {fieldGridItem(item, index)}
            {minusButtonGridItem(index)}
            {fieldArrayErrorGridItem(index, error)}
            {addMoreButtonGridItem(index)}
          </React.Fragment>
        ))
      }
      </>
    );
  }
}

RenderFields.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  validateField: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  placeholderText: PropTypes.string,
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

function ReduxFieldArray(props) {
  const { fieldName } = props;
  const fieldArray = <FieldArray name={fieldName} component={RenderFields} {...props} />;
  return fieldArray;
}

export default ReduxFieldArray;
