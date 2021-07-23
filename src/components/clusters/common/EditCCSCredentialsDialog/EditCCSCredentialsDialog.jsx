import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Form, TextInput, FormGroup,
} from '@patternfly/react-core';
import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';

class EditCCSCredentialsDialog extends Component {
    state = {
      awsaccesskeyid: '',
      awssecretaccesskey: '',
      isUpdated: false,
    };

    componentDidUpdate() {
      const {
        editClusterResponse, resetResponse, closeModal, onClose,
      } = this.props;

      if (editClusterResponse.fulfilled) {
        resetResponse();
        closeModal();
        onClose();
      }
    }

    onClose = () => {
      const {
        resetResponse, closeModal,
      } = this.props;
      this.setState({
        awsaccesskeyid: '',
        awssecretaccesskey: '',
        isUpdated: false,
      });
      resetResponse();
      closeModal();
    };

    render() {
      const {
        submit, editClusterResponse, clusterID, awsAccountID,
        clusterDisplayName, shouldDisplayClusterName,
      } = this.props;
      const { isUpdated } = this.state;
      const errorContainer = editClusterResponse.error && (
        <ErrorBox message="Error updating aws credentials" response={editClusterResponse} />
      );

      const validateCCSCredentialsValues = () => {
        const {
          awsaccesskeyid, awssecretaccesskey,
        } = this.state;
        if (awsaccesskeyid === '' && awssecretaccesskey === '') {
          return 'At least one of the field is required';
        }
        return undefined;
      };

      const validationMessage = validateCCSCredentialsValues();

      const handleSubmit = () => {
        if (!validationMessage) {
          submit(clusterID, this.state);
        }
      };
      return (
        <Modal
          title="Edit AWS account credentials"
          secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
          onClose={() => this.onClose()}
          secondaryText="Cancel"
          onPrimaryClick={handleSubmit}
          onSecondaryClick={() => this.onClose()}
          isPrimaryDisabled={!!validationMessage || editClusterResponse.pending}
        >
          {errorContainer}
          <>
            <Form onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
              <p>

                You can update your AWS credentials used for this cluster.
                The updated credentials must be associated with the same AWS account ID.
              </p>

              <FormGroup
                label="AWS Account ID"
                fieldId="awsAccountID"
              >
                <TextInput
                  name="awsAccountID"
                  id="awsAccountID"
                  aria-label="AWS Account ID"
                  type="text"
                  value={awsAccountID}
                  isDisabled={false}
                />
              </FormGroup>
              <FormGroup
                label="AWS access key ID"
                fieldId="awsaccesskeyid"
                helperTextInvalid={validationMessage}
                validated={(isUpdated ? !validationMessage : true) ? 'default' : 'error'}
              >
                <TextInput
                  name="awsaccesskeyid"
                  aria-label="AWS access key ID"
                  id="awsaccesskeyid"
                  type="text"
                  validated={(isUpdated ? !validationMessage : true) ? 'default' : 'error'}
                  onChange={value => this.setState({ awsaccesskeyid: value, isUpdated: true })}
                />
              </FormGroup>
              <FormGroup
                label="AWS secret access key"
                fieldId="awssecretaccesskey"
                helperTextInvalid={validationMessage}
                validated={(isUpdated ? !validationMessage : true) ? 'default' : 'error'}
              >
                <TextInput
                  name="awssecretaccesskey"
                  id="awssecretaccesskey"
                  aria-label="AWS secret access key"
                  type="password"
                  onChange={value => this.setState({ awssecretaccesskey: value, isUpdated: true })}
                  validated={(isUpdated ? !validationMessage : true) ? 'default' : 'error'}
                />
              </FormGroup>

            </Form>
          </>
        </Modal>
      );
    }
}

EditCCSCredentialsDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  clusterID: PropTypes.string,
  awsAccountID: PropTypes.string,
  shouldDisplayClusterName: PropTypes.bool,
  clusterDisplayName: PropTypes.string.isRequired,
};

EditCCSCredentialsDialog.modalName = modals.EDIT_CCS_CREDENTIALS;

export default EditCCSCredentialsDialog;
