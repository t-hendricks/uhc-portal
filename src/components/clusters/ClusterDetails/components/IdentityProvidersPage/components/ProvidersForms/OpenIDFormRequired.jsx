import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import IDPBasicFields from './IDPBasicFields';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { checkOpenIDIssuer } from '../../../../../../../common/validators';
import ReduxFieldArray from '../../../../../../common/ReduxFormComponents/ReduxFieldArray';
import { isEmptyReduxArray } from '../../IdentityProvidersHelper';

class OpenIDFormRequired extends React.Component {
  state = {
    isGroupError: false,
  };

  validate = (_, allValues) => {
    if (
      isEmptyReduxArray(allValues.openid_preferred_username, 'openid_preferred_username') &&
      isEmptyReduxArray(allValues.openid_name, 'openid_name') &&
      isEmptyReduxArray(allValues.openid_email, 'openid_email')
    ) {
      return 'At least one claim is required';
    }
    return undefined;
  };

  onValueChange = () => {
    this.setState({ isGroupError: true });
  };

  render() {
    const { isPending } = this.props;
    const { isGroupError } = this.state;
    return (
      <>
        <IDPBasicFields />
        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="issuer"
            label="Issuer URL"
            type="text"
            disabled={isPending}
            validate={checkOpenIDIssuer}
            isRequired
            helpText="The URL that the OpenID provider asserts as the issuer identifier. It must use the https scheme with no URL query parameters or fragment."
          />
        </GridItem>
        <GridItem span={8}>
          <h4>Claims mappings</h4>
        </GridItem>
        <ReduxFieldArray
          fieldName="openid_email"
          label="Email"
          type="text"
          placeholderText="e.g. email"
          disabled={isPending}
          helpText="The list of attributes whose values should be used as the email address."
          validate={this.validate}
          isGroupError={isGroupError}
          onFormChange={this.onValueChange}
          isRequired
        />
        <ReduxFieldArray
          fieldName="openid_name"
          label="Name"
          type="text"
          placeholderText="e.g. name"
          disabled={isPending}
          validate={this.validate}
          isGroupError={isGroupError}
          onFormChange={this.onValueChange}
          helpText="The end user's full name including all name parts, ordered according to the end user's locale and preferences."
          isRequired
        />
        <ReduxFieldArray
          fieldName="openid_preferred_username"
          label="Preferred username"
          type="text"
          placeholderText="e.g. preferred_username"
          disabled={isPending}
          validate={this.validate}
          isGroupError={isGroupError}
          onFormChange={this.onValueChange}
          helpText="Shorthand name by which the end user wishes to be referred to at the RP, such as janedone or j.doe."
          isRequired
        />
      </>
    );
  }
}

OpenIDFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDFormRequired.defaultProps = {
  isPending: false,
};

export default OpenIDFormRequired;
