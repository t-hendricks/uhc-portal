import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form, Alert, Grid, Row, Col, HintBlock, ExpandCollapse,
} from 'patternfly-react';

import { ReduxVerticalFormGroup, ReduxFormDropdown } from '../../../../../common/ReduxFormComponents';
import { checkIdentityProviderName } from '../../../../../../common/validators';

import {
  GithubForm,
  LDAPForm,
  OpenIDForm,
  GithubFormRequired,
  LDAPFormRequired,
  OpenIDFormRequired,
  GoogleFormRequired,
} from './ProvidersForms';

import {
  IDPtypes, mappingMethods, LDAPDocLink, GithubDocLink, OpenIDDocLink, GoogleDocLink,
} from '../IdentityProvidersHelper';

function IDPForm(props) {
  const { createIDPResponse, selectedIDP } = props;

  const isPending = createIDPResponse.pending;

  const createIDPError = createIDPResponse.error && (
    <Alert>
      <span>{`Error creating Identity Provider: ${createIDPResponse.errorMessage}`}</span>
    </Alert>);


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
    <Form>
      {createIDPError}
      <Grid>
        <Row>
          <h4>
                Identity providers determine how users log into the cluster.
                Add an identity provider by selecting a type from the dropdown
            {' '}
            <br />
            {' '}
                below.
          </h4>
        </Row>
        <Row>
          <h3>Step 1: Select identity providers type</h3>
          <Col sm={5}>
            <Field
              component={ReduxFormDropdown}
              options={IDPtypes}
              name="type"
              label="Identity Provider"
              disabled={isPending}
            />
          </Col>
        </Row>
        <Row>
          <h3>Step 2: Enter Provider type information</h3>
          <Col sm={5}>
            <Field
              component={ReduxVerticalFormGroup}
              name="name"
              label="Name"
              type="text"
              placeholder="name"
              validate={checkIdentityProviderName}
              disabled={isPending}
            />
            {SelectedProivderRequiredFields
                  && (
                  <SelectedProivderRequiredFields isPending={isPending} />
                  )}
          </Col>
          <Col sm={4}>
            <HintBlock
              title="Learn more about ClientID and and Client Secret"
              body={(
                <React.Fragment>
                  <p>
                        Learn more about identity providers in the OpenShift documentation.
                  </p>
                  <p>
                    <a target="_blank" href={providerDocumentationLink[selectedIDP]}>Learn more</a>
                  </p>
                </React.Fragment>
                  )}
            />
          </Col>
        </Row>
        <Row>
          <ExpandCollapse>
            <Col sm={5} id="idp-advanced-options">
              {SelectedProviderAdvancedOptions
                    && (
                    <SelectedProviderAdvancedOptions isPending={isPending} />
                    )}
              <Field
                component={ReduxFormDropdown}
                options={mappingMethods}
                name="mappingMethod"
                label="Mapping Method"
              />
            </Col>
          </ExpandCollapse>
        </Row>
      </Grid>
    </Form>
  );
}

IDPForm.propTypes = {
  createIDPResponse: PropTypes.object,
  selectedIDP: PropTypes.string,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
};

export default IDPForm;
