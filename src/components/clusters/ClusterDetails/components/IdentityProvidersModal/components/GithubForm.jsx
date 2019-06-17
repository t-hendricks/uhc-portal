import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../../common/validators';
import { noop } from '../../../../../../common/helpers';

class GithubForm extends React.Component {
  state = {
    hostnameRequired: false,
  };

  toggleHostnameRequired = (e, value) => {
    if (value) {
      this.setState({ hostnameRequired: true });
    } else {
      this.setState({ hostnameRequired: false });
    }
  }

  render() {
    const { createIDPResponse } = this.props;
    const { hostnameRequired } = this.state;

    return (
      <React.Fragment>
        <Field
          component={ReduxVerticalFormGroup}
          name="hostname"
          label="Hostname"
          type="text"
          placeholder="hostname"
          disabled={createIDPResponse.pending}
          validate={hostnameRequired ? validators.required : noop}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="github_ca"
          label="CA"
          type="text"
          placeholder="CA"
          helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL."
          disabled={createIDPResponse.pending}
          className="ca-textarea"
          componentClass="textarea"
          spellCheck="false"
          onChange={(e, value) => this.toggleHostnameRequired(e, value)}
        />

      </React.Fragment>

    );
  }
}

GithubForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

GithubForm.defaultProps = {
  createIDPResponse: {},
};

export default GithubForm;
