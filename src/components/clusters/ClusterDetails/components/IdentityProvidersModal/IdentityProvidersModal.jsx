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
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import validators from '../../../../../common/validators';
import ModalHeader from '../../../../common/Modal/components/ModalHeader';
import { toCleanArray } from '../../../../../common/helpers';

class IdentityProvidersModal extends React.Component {
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

  render() {
    const {
      isOpen, handleSubmit, createIDPResponse, clusterName,
    } = this.props;

    const createIDPError = createIDPResponse.error && (
    <Alert>
      <span>{`Error creating Identity Provider: ${createIDPResponse.errorMessage}`}</span>
    </Alert>);

    const loadingSpinner = () => (
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
    // {
    //   name: 'Gitlab',
    //   value: 'GitlabIdentityProvider',
    // },
    // {
    //   name: 'Google',
    //   value: 'GoogleIdentityProvider',
    // },
    // {
    //   name: 'OpenID',
    //   value: 'OpenIDIdentityProvider',
    // },
    // {
    //   name: 'LDAP',
    //   value: 'LDAPIdentityProvider',
    // },
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

                <Field
                  component={ReduxVerticalFormGroup}
                  name="client_id"
                  label="Client ID"
                  type="text"
                  placeholder="Client ID"
                  validate={validators.required}
                  disabled={createIDPResponse.pending}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="client_secret"
                  label="Client Secret"
                  type="password"
                  placeholder="Client Secret"
                  validate={validators.required}
                  disabled={createIDPResponse.pending}
                />
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
                        <a target="_blank" href="https://docs.openshift.com/enterprise/3.0/admin_guide/configuring_authentication.html">Learn more</a>
                      </p>
                    </React.Fragment>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <ExpandCollapse>
                <Col sm={5} id="idp-advanced-options">
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="hostname"
                    label="Hostname"
                    type="text"
                    placeholder="hostname"
                    disabled={createIDPResponse.pending}
                  />
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="organizations"
                    label="Organizations"
                    type="text"
                    placeholder="comma separated, example: 'org1,org2,org3"
                    disabled={createIDPResponse.pending}
                    normalize={toCleanArray}
                  />
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="teams"
                    label="Teams"
                    type="text"
                    placeholder="comma separated, example: 'team1,team2"
                    disabled={createIDPResponse.pending}
                    normalize={toCleanArray}
                  />
                  <Field
                    component={ReduxFormDropdown}
                    options={mappingMethods}
                    name="mappingMethod"
                    label="Mapping Method"
                  />
                  <Field
                    component={ReduxCheckbox}
                    name="challenge"
                    label="Challenge"
                    disabled={createIDPResponse.pending}
                  />
                  <Field
                    component={ReduxCheckbox}
                    name="login"
                    label="Login"
                    disabled={createIDPResponse.pending}
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
        {createIDPResponse.pending ? loadingSpinner() : null}
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
};

IdentityProvidersModal.defaultProps = {
  clusterName: '',
  isOpen: false,
};

export default IdentityProvidersModal;
