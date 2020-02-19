import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import { required } from '../../../../../../../common/validators';

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
    const { isPending } = this.props;
    const { hasBindDN } = this.state;

    return (
      <>
        <Field
          component={ReduxVerticalFormGroup}
          name="bind_dn"
          label="Bind DN"
          type="text"
          disabled={isPending}
          onChange={this.toggleBindPasswordDisabled}
          helpText="DN to bind with during the search phase."
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="bind_password"
          label="Bind Password"
          type="password"
          helpText={!hasBindDN ? 'Cannot be used if Bind DN is not set' : 'Password to bind with during the search phase.'}
          disabled={!hasBindDN || isPending}
          validate={hasBindDN ? required : undefined}
          isRequired={hasBindDN}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_url"
          label="LDAP url"
          type="text"
          disabled={isPending}
          validate={required}
          isRequired
          helpText="An RFC 2255 URL which specifies the LDAP search parameters to use."
        />
        <h4>Attributes</h4>
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_id"
          label="ID"
          type="text"
          placeholder="e.g. id1, id2"
          disabled={isPending}
          validate={required}
          isRequired
          helpText="The list of attributes whose values should be used as the ID."
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_email"
          label="Email"
          type="text"
          placeholder="e.g. email,email2"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the email address."
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_name"
          label="Name"
          type="text"
          placeholder="e.g. name1, name2"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the display name."
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="ldap_preferred_username"
          label="Preferred Username"
          type="text"
          placeholder="e.g. name1, name2, name3"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the preferred username."
        />
      </>
    );
  }
}

LDAPFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

LDAPFormRequired.defaultProps = {
  isPending: false,
};

export default LDAPFormRequired;
