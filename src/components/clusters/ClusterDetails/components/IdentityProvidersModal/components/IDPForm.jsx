import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form, Grid, GridItem, Expandable,
} from '@patternfly/react-core';
import ErrorBox from '../../../../../common/ErrorBox';

import { ReduxVerticalFormGroup, ReduxFormDropdown } from '../../../../../common/ReduxFormComponents';
import { checkIdentityProviderName } from '../../../../../../common/validators';

import {
  GithubForm,
  LDAPForm,
  OpenIDForm,
  GoogleFormRequired,
  GithubFormRequired,
  LDAPFormRequired,
  OpenIDFormRequired,
} from './ProvidersForms';

import {
  IDPtypes,
  mappingMethods,
  IDPformValues,
  mappingMethodsformValues,
  LDAPDocLink,
  GithubDocLink,
  OpenIDDocLink,
  GoogleDocLink,
} from '../IdentityProvidersHelper';

function IDPForm(props) {
  const { createIDPResponse, selectedIDP, selectedMappingMethod } = props;

  const isPending = createIDPResponse.pending;

  const createIDPError = createIDPResponse.error && (
    <ErrorBox title="Error creating Identity Provider" response={createIDPResponse} />
  );

  const providersAdvancedOptions = {
    GithubIdentityProvider: GithubForm,
    OpenIDIdentityProvider: OpenIDForm,
    LDAPIdentityProvider: LDAPForm,
  };

  const providersRequiredFields = {
    LDAPIdentityProvider: LDAPFormRequired,
    OpenIDIdentityProvider: OpenIDFormRequired,
    GithubIdentityProvider: GithubFormRequired,
    GoogleIdentityProvider: GoogleFormRequired,
  };

  const providerDocumentationLink = {
    LDAPIdentityProvider: LDAPDocLink,
    OpenIDIdentityProvider: OpenIDDocLink,
    GithubIdentityProvider: GithubDocLink,
    GoogleIdentityProvider: GoogleDocLink,
  };

  const SelectedProivderRequiredFields = providersRequiredFields[selectedIDP];
  const SelectedProviderAdvancedOptions = providersAdvancedOptions[selectedIDP];

  return (
    <Grid>
      <GridItem span={8}>
        <Form>
          {createIDPError}
          <p>
        Identity providers determine how users log into the cluster.
        Add an identity provider by selecting a type from the dropdown below.
          </p>
          <p>
            <a target="_blank" href={providerDocumentationLink[selectedIDP]}>Learn more about identity providers in the OpenShift documentation.</a>
          </p>
          <h3>Step 1: Select identity providers type</h3>
          <Field
            component={ReduxFormDropdown}
            options={IDPtypes}
            name="type"
            label="Identity Provider"
            disabled={isPending}
          />
          <h3>Step 2: Enter Provider type information</h3>
          <Field
            component={ReduxVerticalFormGroup}
            name="name"
            label="Name"
            type="text"
            placeholder="name"
            validate={checkIdentityProviderName}
            isRequired
            disabled={isPending}
            helpText="Unique name for the identity provider. This cannot be changed later."
          />
          {SelectedProivderRequiredFields
        && (
          <SelectedProivderRequiredFields
            isPending={isPending}
            // make google required form optional when mapping method is lookup
            isRequired={selectedIDP === IDPformValues.GOOGLE
            && !(selectedMappingMethod === mappingMethodsformValues.LOOKUP)}
          />)
      }
          <Expandable toggleText="Show Advanced Options">
            {SelectedProviderAdvancedOptions
          && (
            <SelectedProviderAdvancedOptions isPending={isPending} />
          )}
            <Field
              component={ReduxFormDropdown}
              options={mappingMethods}
              name="mappingMethod"
              label="Mapping Method"
              helpText="Specifies how new identities are mapped to users when the log in. Claim is recommended in most cases."
            />
          </Expandable>
        </Form>
      </GridItem>
    </Grid>
  );
}

IDPForm.propTypes = {
  createIDPResponse: PropTypes.object,
  selectedIDP: PropTypes.string,
  selectedMappingMethod: PropTypes.string,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
};

export default IDPForm;
