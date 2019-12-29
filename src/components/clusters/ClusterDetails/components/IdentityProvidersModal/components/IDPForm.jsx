import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form, Grid, GridItem, Expandable, Title,
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
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
} from '../IdentityProvidersHelper';

class IDPForm extends React.Component {
  state = {
    IDPName: '',
  };

  render() {
    const {
      createIDPResponse, selectedIDP, selectedMappingMethod, clusterConsoleURL,
    } = this.props;
    const { IDPName } = this.state;

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
              <a target="_blank" rel="noreferrer noopener" href={providerDocumentationLink[selectedIDP]}>Learn more about identity providers in the OpenShift documentation.</a>
            </p>
            <Title headingLevel="h3" size="xl">Step 1: Select identity providers type</Title>
            <Field
              component={ReduxFormDropdown}
              options={IDPtypes}
              name="type"
              label="Identity Provider"
              disabled={isPending}
            />
            <Title headingLevel="h3" size="xl">Step 2: Enter Provider type information</Title>
            <Field
              component={ReduxVerticalFormGroup}
              name="name"
              label="Name"
              type="text"
              placeholder="name"
              validate={checkIdentityProviderName}
              isRequired
              disabled={isPending}
              onChange={(_, value) => this.setState({ IDPName: value })}
              helpText="Unique name for the identity provider. This cannot be changed later."
            />
            { IDPNeedsOAuthURL(selectedIDP) && (
              <div>
                <span className="pf-c-form__label pf-c-form__label-text">OAuth callback URL</span>
                <pre className="idp-oauth-url">{getOauthCallbackURL(clusterConsoleURL, IDPName)}</pre>
              </div>
            )}
            {SelectedProivderRequiredFields
        && (
          <SelectedProivderRequiredFields
            isPending={isPending}
            // make google required form optional when mapping method is lookup
            isRequired={selectedIDP === IDPformValues.GOOGLE
            && !(selectedMappingMethod === mappingMethodsformValues.LOOKUP)}
          />
        )}
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
}

IDPForm.propTypes = {
  clusterConsoleURL: PropTypes.string,
  createIDPResponse: PropTypes.object,
  selectedIDP: PropTypes.string,
  selectedMappingMethod: PropTypes.string,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
  clusterConsoleURL: '',
};

export default IDPForm;
