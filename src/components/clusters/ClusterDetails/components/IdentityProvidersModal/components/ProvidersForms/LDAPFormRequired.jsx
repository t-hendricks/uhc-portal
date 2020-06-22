import React from 'react';
import PropTypes from 'prop-types';
import { GridItem, Divider, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';
import ReduxFieldArray from '../../../../../../common/ReduxFormComponents/ReduxFieldArray';

class LDAPFormRequired extends React.Component {
  state={
    hasBindDN: false,
  }

  componentDidMount() {
    const { isEditForm, idpEdited } = this.props;
    if (isEditForm && idpEdited.ldap.bind_dn && idpEdited.ldap.bind_dn !== '') {
      this.setState({ hasBindDN: true });
    }
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
        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="ldap_url"
            label="LDAP URL"
            type="text"
            disabled={isPending}
            validate={required}
            isRequired
            helpText="An RFC 2255 URL which specifies the LDAP search parameters to use."
          />
        </GridItem>
        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="bind_dn"
            label="Bind DN"
            type="text"
            disabled={isPending}
            onChange={this.toggleBindPasswordDisabled}
            helpText="DN to bind with during the search phase."
          />
        </GridItem>

        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="bind_password"
            label="Bind password"
            type="password"
            helpText={!hasBindDN ? 'Cannot be used if Bind DN is not set' : 'Password to bind with during the search phase.'}
            disabled={!hasBindDN || isPending}
            validate={hasBindDN ? required : undefined}
            isRequired={hasBindDN}
          />
        </GridItem>
        <GridItem span={8}>
          <Divider />
          <Title headingLevel="h3" size="xl" className="idp-helptext-heading">
            Attributes
          </Title>
          <p>
            Attributes map LDAP attributes to identities.
          </p>
        </GridItem>
        <ReduxFieldArray
          fieldName="ldap_id"
          label="ID"
          type="text"
          placeholderText="e.g. id"
          disabled={isPending}
          isRequired
          validateField={required}
          helpText="The list of attributes whose values should be used as the user ID."
        />
        <ReduxFieldArray
          fieldName="ldap_preferred_username"
          label="Preferred username"
          type="text"
          placeholderText="e.g. preferred_username"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the preferred username."
        />
        <ReduxFieldArray
          fieldName="ldap_name"
          label="Name"
          type="text"
          placeholderText="e.g. name"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the display name."
        />
        <ReduxFieldArray
          fieldName="ldap_email"
          label="Email"
          type="text"
          placeholderText="e.g. email"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the email address."
        />
      </>
    );
  }
}

LDAPFormRequired.propTypes = {
  isPending: PropTypes.bool,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
};

LDAPFormRequired.defaultProps = {
  isPending: false,
};

export default LDAPFormRequired;
