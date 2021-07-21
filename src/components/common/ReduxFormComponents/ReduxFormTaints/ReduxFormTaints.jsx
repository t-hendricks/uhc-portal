import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import ReduxFormDropdown from '../ReduxFormDropdown';
import { getRandomID } from '../../../../common/helpers';

import '../ReduxFormKeyValueList/ReduxFormKeyValueList.scss';

const ReduxFormTaints = ({ fields, meta: { error, submitFailed }, isEditing = false }) => (
  <div className="reduxFormKeyValueList">
    <div className="pf-c-form__label reduxFormKeyValueList-colTitles">
      <div className="reduxFormKeyValueList-title pf-c-form__label-text">Key</div>
      <div className="reduxFormKeyValueList-title reduxFormKeyValueList-title-value pf-c-form__label-text">Value</div>
      <div className="reduxFormKeyValueList-title reduxFormKeyValueList-title-value pf-c-form__label-text">Effect</div>
    </div>
    {fields.map((label, index) => {
      const isRemoveDisabled = !isEditing && index === 0 && fields.length === 1;

      return (
        <div className="pf-u-mb-md" key={`${fields.get(index).id}`}>
          <Field
            name={`${label}.key`}
            component={ReduxVerticalFormGroup}
            index={index}
            aria-label="Key-value list key"
            formGroupClass="reduxFormKeyValueList-key"
            isRequired
          />
          <Field
            name={`${label}.value`}
            component={ReduxVerticalFormGroup}
            index={index}
            aria-label="Key-value list value"
            formGroupClass="reduxFormKeyValueList-value"
            isRequired
          />
          <Field
            name={`${label}.effect`}
            component={ReduxFormDropdown}
            options={[
              { name: 'NoSchedule', value: 'NoSchedule' },
              { name: 'NoExecute', value: 'NoExecute' },
              { name: 'PreferNoSchedule', value: 'PreferNoSchedule' },
            ]}
            className="reduxFormKeyValueList-extraField"
            isFormGroup={false}
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
      onClick={() => fields.push({ id: getRandomID(), effect: 'NoSchedule' })}
      icon={<PlusCircleIcon />}
      variant="link"
      className="reduxFormKeyValueList-addBtn pf-u-mb-lg"
    >
      Add taint
    </Button>
    {submitFailed && error && <span>{error}</span>}
  </div>
);

ReduxFormTaints.propTypes = {
  fields: PropTypes.array.isRequired,
  isEditing: PropTypes.bool,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
};

export default ReduxFormTaints;
