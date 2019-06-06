/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Modal, Button, Form, Alert, Grid, Row, Col, Spinner, HintBlock, ExpandCollapse,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ReduxFormDropdown from '../../../../common/ReduxFormComponents/ReduxFormDropdown';
import validators from '../../../../../common/validators';
import ModalHeader from '../../../../common/Modal/components/ModalHeader';

import GithubForm from './components/GithubForm';
import LDAPForm from './components/LDAPForm';
import OpenIDForm from './components/OpenIDForm';
import OpenIDFormRequired from './components/OpenIDFormRequired';
import LDAPFormRequired from './components/LDAPFormRequired';
import GithubFormRequired from './components/GithubFormRequired';
import GoogleFormRequired from './components/GoogleFormRequired';

class IdentityProvidersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamsDisabled: false,
      orgsDisabled: false,
    };
    this.toggleDisable = this.toggleDisable.bind(this);
  }

  componentDidUpdate() {
    const { createIDPResponse, getClusterIdentityProviders } = this.props;
    if (createIDPResponse.fulfilled) {
      this.onClose();
      getClusterIdentityProviders();
    }
  }

  onClose = () => {
    const { resetResponse, resetForm, closeModal } = this.props;
    resetResponse();
    resetForm();
    closeModal();
  };

  toggleDisable(e, value, fieldToToggle) {
    // equivalent to: const isDisabled = this.state[fieldToToggle]
    const { [fieldToToggle]: isDisabled } = this.state;

    if (value && !isDisabled) {
      this.setState({ [fieldToToggle]: true });
    } else if ((!value || value === '') && isDisabled) {
      this.setState({ [fieldToToggle]: false });
    }
  }

  render() {
    const {
      isOpen, handleSubmit, createIDPResponse, clusterName, selectedIDP,
    } = this.props;

    const { teamsDisabled, orgsDisabled } = this.state;

    const createIDPError = createIDPResponse.error && (
    <Alert>
      <span>{`Error creating Identity Provider: ${createIDPResponse.errorMessage}`}</span>
    </Alert>);

    const LoadingSpinner = () => (
      <div className="form-loading-spinner">
        <span>Please wait...</span>
        <Spinner size="xs" loading inline />
      </div>
    );

    const IDPtypes = [
      {
        name: 'Github',
        value: 'GithubIdentityProvider',
      },
      {
        name: 'Google',
        value: 'GoogleIdentityProvider',
      },
      {
        name: 'OpenID',
        value: 'OpenIDIdentityProvider',
      },
      {
        name: 'LDAP',
        value: 'LDAPIdentityProvider',
      },
    ];

    const mappingMethods = [
      {
        name: 'claim',
        value: 'claim',
      },
      {
        name: 'lookup',
        value: 'lookup',
      },
      {
        name: 'generate',
        value: 'generate',
      },
      {
        name: 'add',
        value: 'add',
      },
    ];

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

    const LDAPLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-ldap-identity-provider';
    const GithubLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-github-identity-provider';
    const OpenIDLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-oidc-identity-provider';
    const GoogleLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-google-identity-provider';

    const providerDocumentationLink = {
      LDAPIdentityProvider: LDAPLink,
      OpenIDIdentityProvider: OpenIDLink,
      GithubIdentityProvider: GithubLink,
      GoogleIdentityProvider: GoogleLink,
    };

    const SelectedProivderRequiredFields = providersRequiredFields[selectedIDP];
    const SelectedProviderAdvancedOptions = providersAdvancedOptions[selectedIDP];

    return isOpen
    && (
    <Modal show className="right-side-modal-pf" bsSize="large" onHide={this.onClose}>
      <Modal.Header>
        <ModalHeader title={`Create Identity Provider (${clusterName})`} onClose={this.onClose} />
      </Modal.Header>
      <Modal.Body>
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
                  validate={validators.required}
                  disabled={createIDPResponse.pending}
                />
                {SelectedProivderRequiredFields
                  && (
                  <SelectedProivderRequiredFields
                    createIDPResponse={createIDPResponse}
                    toggleDisable={this.toggleDisable}
                    teamsDisabled={teamsDisabled}
                    orgsDisabled={orgsDisabled}
                  />
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
                    <SelectedProviderAdvancedOptions createIDPResponse={createIDPResponse} />
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
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" type="submit" onClick={handleSubmit} disabled={createIDPResponse.pending}>
          Create
        </Button>
        <Button bsStyle="default" onClick={this.onClose} disabled={createIDPResponse.pending}>
          Cancel
        </Button>
        {createIDPResponse.pending ? <LoadingSpinner /> : null}
      </Modal.Footer>
    </Modal>
    );
  }
}

IdentityProvidersModal.propTypes = {
  clusterName: PropTypes.string,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createIDPResponse: PropTypes.object,
  getClusterIdentityProviders: PropTypes.func,
  selectedIDP: PropTypes.string,
};

IdentityProvidersModal.defaultProps = {
  clusterName: '',
  isOpen: false,
  selectedIDP: 'GithubIdentityProvider',
};

export default IdentityProvidersModal;
