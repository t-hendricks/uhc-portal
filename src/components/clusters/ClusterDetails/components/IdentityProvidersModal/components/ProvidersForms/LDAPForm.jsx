import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import { ReduxCheckbox } from '../../../../../../common/ReduxFormComponents';
import CAUpload from '../CAUpload';

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
        <GridItem span={8}>
          <Field
            component={CAUpload}
            name="ldap_ca"
            label="CA File"
            helpText={`PEM encoded certificate bundle to use to validate server certificates for the configured URL. ${caDisabledHelpText}`}
            isDisabled={isInsecure || isPending}
          />
        </GridItem>
        <GridItem span={8}>
          <Field
            component={ReduxCheckbox}
            name="ldap_insecure"
            label="insecure"
            disabled={isPending}
            onChange={this.toggleCADisabled}
          />
        </GridItem>
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
