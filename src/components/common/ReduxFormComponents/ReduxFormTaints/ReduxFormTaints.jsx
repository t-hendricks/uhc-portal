import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Grid, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

import { getRandomID } from '~/common/helpers';
import { checkTaintField } from '~/common/validators';

import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import ReduxFormDropdown from '../ReduxFormDropdown';

import '../ReduxFormKeyValueList/ReduxFormKeyValueList.scss';

const ReduxFormTaints = ({
  fields,
  meta: { error, submitFailed, warning },
  isEditing = false,
  canAddMore,
}) => (
  <Grid hasGutter>
    <GridItem span={3} className="pf-c-form__label pf-c-form__label-text">
      Key
    </GridItem>
    <GridItem span={3} className="pf-c-form__label pf-c-form__label-text">
      Value
    </GridItem>
    <GridItem span={3} className="pf-c-form__label pf-c-form__label-text">
      Effect
    </GridItem>
    <GridItem span={3} />
    {fields.map((label, index) => {
      const isRemoveDisabled = !isEditing && index === 0 && fields.length === 1;

      return (
        <React.Fragment key={`${fields.get(index).id}`}>
          <GridItem span={3}>
            <Field
              name={`${label}.key`}
              component={ReduxVerticalFormGroup}
              index={index}
              aria-label="Key-value list key"
              isRequired
              validate={checkTaintField}
            />
          </GridItem>
          <GridItem span={3}>
            <Field
              name={`${label}.value`}
              component={ReduxVerticalFormGroup}
              index={index}
              aria-label="Key-value list value"
              isRequired
              validate={checkTaintField}
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
        isDisabled={!canAddMore || !!warning}
        className="reduxFormKeyValueList-addBtn pf-u-mb-lg"
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
