import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../common/validators';
import { AWSCredentialsHint } from './CreateClusterModalHelper';

function CredentialsForm(props) {
  const {
    header, pending,
  } = props;
  return (
    <React.Fragment>
      <h3>{header}</h3>
      <Col sm={5}>
        <Field
          component={ReduxVerticalFormGroup}
          name="aws_access_key_id"
          label="AWS access key ID"
          type="password"
          placeholder="AWS access key ID"
          validate={validators.required}
          disabled={pending}
        />

        <Field
          component={ReduxVerticalFormGroup}
          name="aws_secret_access_key"
          label="AWS secret access key"
          type="password"
          placeholder="AWS secret access key"
          validate={validators.required}
          disabled={pending}
        />
      </Col>
      <Col sm={4}>
        <AWSCredentialsHint />
      </Col>
    </React.Fragment>
  );
}

CredentialsForm.propTypes = {
  header: PropTypes.string.isRequired,
  pending: PropTypes.bool,
};

export default CredentialsForm;
