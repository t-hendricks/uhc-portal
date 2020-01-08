import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { ReduxCheckbox, ReduxVerticalFormGroup } from '../../../../../../common/ReduxFormComponents';

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
      this.setState({ isInsecure: true, caDisabledHelpText: 'Cannot be used if insecure is set.' });
    } else {
      this.setState(this.getInitialState());
    }
  };

  render() {
    const { isPending } = this.props;
    const { isInsecure, caDisabledHelpText } = this.state;

    return (
      <>
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_ca"
          label="CA"
          type="text"
          helpText={`PEM encoded certificate bundle to use to validate server certificates for the configured URL. ${caDisabledHelpText}`}
          disabled={isInsecure || isPending}
          className="ca-textarea"
          isTextArea
          spellCheck="false"
        />
        <Field
          component={ReduxCheckbox}
          name="ldap_insecure"
          label="insecure"
          disabled={isPending}
          onChange={this.toggleCADisabled}
        />
      </>
    );
  }
}

LDAPForm.propTypes = {
  isPending: PropTypes.bool,
};

LDAPForm.defaultProps = {
  isPending: false,
};

export default LDAPForm;
