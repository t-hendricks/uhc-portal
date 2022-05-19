import React from 'react';
import { Field } from 'redux-form';
import { acknowledgePrerequisites } from '../../../../common/validators';
import ReduxCheckbox from '../../../common/ReduxFormComponents/ReduxCheckbox';

function AcknowledgePrerequisites() {
  return (
    <Field
      component={ReduxCheckbox}
      name="acknowledge_prerequisites"
      label="I’ve read and completed all the prerequisites and am ready to continue creating my cluster."
      validate={acknowledgePrerequisites}
      showInitialValidationErrors
      isRequired
    />
  );
}

export default AcknowledgePrerequisites;
