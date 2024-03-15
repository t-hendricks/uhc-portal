import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Grid, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';

import { getRandomID } from '~/common/helpers';
import { checkTaintKey, checkTaintValue } from '~/common/validators';

import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import ReduxFormDropdown from '../ReduxFormDropdown';

import '../ReduxFormKeyValueList/ReduxFormKeyValueList.scss';

const ReduxFormTaints = ({
  fields,
  meta: { error, submitFailed },
  isEditing = false,
  canAddMore,
}) => (
  <Grid hasGutter>
    <GridItem span={3} className="pf-v5-c-form__label pf-v5-c-form__label-text">
      Key
    </GridItem>
    <GridItem span={3} className="pf-v5-c-form__label pf-v5-c-form__label-text">
      Value
    </GridItem>
    <GridItem span={3} className="pf-v5-c-form__label pf-v5-c-form__label-text">
      Effect
    </GridItem>
    <GridItem span={3} />
    {fields.map((label, index) => {
      const isRemoveDisabled = !isEditing && index === 0 && fields.length === 1;

      return (
        <React.Fragment key={`${fields.get(index).id}-${label.key}`}>
          <GridItem span={3}>
            <Field
              name={`${label}.key`}
              component={ReduxVerticalFormGroup}
              index={index}
              aria-label="Key-value list key"
              isRequired
              validate={checkTaintKey}
            />
          </GridItem>
          <GridItem span={3}>
            <Field
              name={`${label}.value`}
              component={ReduxVerticalFormGroup}
              index={index}
              aria-label="Key-value list value"
              isRequired
              validate={checkTaintValue}
            />
          </GridItem>
          <GridItem span={3}>
            <Field
              name={`${label}.effect`}
              component={ReduxFormDropdown}
              options={[
                { name: 'NoSchedule', value: 'NoSchedule' },
                { name: 'NoExecute', value: 'NoExecute' },
                { name: 'PreferNoSchedule', value: 'PreferNoSchedule' },
              ]}
              isFormGroup={false}
            />
          </GridItem>
          <GridItem span={3}>
            <Button
              onClick={() => fields.remove(index)}
              aria-label="Remove item"
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
      <Button
        onClick={() => fields.push({ id: getRandomID(), effect: 'NoSchedule' })}
        icon={<PlusCircleIcon />}
        variant="link"
        isInline
        isDisabled={!canAddMore}
        className="reduxFormKeyValueList-addBtn pf-v5-u-mb-lg"
      >
        Add taint
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </GridItem>
  </Grid>
);

ReduxFormTaints.propTypes = {
  fields: PropTypes.array.isRequired,
  isEditing: PropTypes.bool,
  // The "meta" field does not receive accurate "valid / invalid" values
  canAddMore: PropTypes.bool,
  meta: PropTypes.shape({
    error: PropTypes.string,
    warning: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
};

export default ReduxFormTaints;
