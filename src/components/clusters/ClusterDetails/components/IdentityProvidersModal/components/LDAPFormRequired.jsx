import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import validators from '../../../../../../common/validators';

class LDAPFormRequired extends React.Component {
  state={
    hasBindDN: false,
  }

  toggleBindPasswordDisabled = (e, value) => {
    if (value) {
      this.setState({ hasBindDN: true });
    } else {
      this.setState({ hasBindDN: false });
    }
  }

  render() {
    const { createIDPResponse } = this.props;
    const { hasBindDN } = this.state;

    return (
      <React.Fragment>
        <Field
          component={ReduxVerticalFormGroup}
          name="bind_dn"
          label="Bind DN"
          type="text"
          placeholder="Bind DN"
          disabled={createIDPResponse.pending}
          onChange={this.toggleBindPasswordDisabled}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="bind_password"
          label="Bind Password"
          type="password"
          placeholder="Bind Password"
          helpText={!hasBindDN ? 'Cannot be used if Bind DN is not set' : ''}
          disabled={!hasBindDN || createIDPResponse.pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_url"
          label="LDAP url"
          type="text"
          placeholder="url"
          disabled={createIDPResponse.pending}
          validate={validators.required}
        />
        <h4>Attributes</h4>
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_id"
          label="ID"
          type="text"
          placeholder="comma separated, example: 'id1, id-2"
          disabled={createIDPResponse.pending}
          validate={validators.required}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_email"
          label="Email"
          type="text"
          placeholder="comma separated, example: ***REMOVED***, ***REMOVED***"
          disabled={createIDPResponse.pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_name"
          label="Name"
          type="text"
          placeholder="comma separated, example: 'name1, name2"
          disabled={createIDPResponse.pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_preferred_username"
          label="Preferred Username"
          type="text"
          placeholder="comma separated, example: 'name1, name2, name3"
          disabled={createIDPResponse.pending}
        />
      </React.Fragment>
    );
  }
}

LDAPFormRequired.propTypes = {
  createIDPResponse: PropTypes.object,
};

LDAPFormRequired.defaultProps = {
  createIDPResponse: {},
};

export default LDAPFormRequired;
