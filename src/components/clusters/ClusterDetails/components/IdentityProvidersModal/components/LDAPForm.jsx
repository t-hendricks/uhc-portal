import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

class LDAPForm extends React.Component {
  state = this.getInitialState();

  getInitialState() {
    return ({
      isInsecure: false,
      caDisabledHelpText: '',
    });
  }

  toggleCADisabled = (e, value) => {
    if (value) {
      this.setState({ isInsecure: true, caDisabledHelpText: 'Cannot be used if insecure is set' });
    } else {
      this.setState(this.getInitialState());
    }
  };

  render() {
    const { createIDPResponse } = this.props;
    const { isInsecure, caDisabledHelpText } = this.state;

    return (
      <React.Fragment>
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_ca"
          label="CA"
          type="text"
          placeholder="CA"
          helpText={`PEM encoded certificate bundle to use to validate server certificates for the configured URL ${caDisabledHelpText}.`}
          disabled={isInsecure || createIDPResponse.pending}
          className="ca-textarea"
          componentClass="textarea"
          spellcheck="false"
        />
        <Field
          component={ReduxCheckbox}
          name="ldap_insecure"
          label="insecure"
          disabled={createIDPResponse.pending}
          onChange={this.toggleCADisabled}
        />
      </React.Fragment>
    );
  }
}

LDAPForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

LDAPForm.defaultProps = {
  createIDPResponse: {},
};

export default LDAPForm;
