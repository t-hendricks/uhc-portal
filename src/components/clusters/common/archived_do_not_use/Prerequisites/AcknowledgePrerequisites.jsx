import React from 'react';
import { Field } from 'formik';

import { acknowledgePrerequisites } from '../../../../../common/validators';
import Checkbox from '../../../../common/ReduxFormComponents_deprecated/ReduxCheckbox';

function AcknowledgePrerequisites() {
  return (
    <Field
      component={Checkbox}
      name="acknowledge_prerequisites"
      label="I’ve read and completed all the prerequisites and am ready to continue creating my cluster."
      validate={acknowledgePrerequisites}
      showInitialValidationErrors
      isRequired
    />
  );
}

export default AcknowledgePrerequisites;
