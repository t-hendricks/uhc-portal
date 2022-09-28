import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput, FormGroup } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';
import { checkClusterConsoleURL } from '../../../../common/validators';

class EditConsoleURLDialog extends Component {
  state = {
    currentValue: '',
  };

  componentDidMount() {
    const { consoleURL } = this.props;
    this.setState({ currentValue: consoleURL });
  }

  componentDidUpdate() {
    const { editClusterResponse, resetResponse, closeModal, onClose } = this.props;
    if (editClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  setValue(newValue) {
    this.setState({
      currentValue: newValue,
    });
  }

  render() {
    const {
      closeModal,
      submit,
      editClusterResponse,
      resetResponse,
      clusterID,
      subscriptionID,
      consoleURL,
      shouldDisplayClusterName,
      clusterDisplayName,
    } = this.props;
    const { currentValue } = this.state;

    const cancelEdit = () => {
      this.setState({ currentValue: null });
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox message="Error changing console URL" response={editClusterResponse} />
    );

    const validationMessage = checkClusterConsoleURL(currentValue, true);
    const handleSubmit = () => {
      if (!validationMessage) {
        submit(clusterID, subscriptionID, currentValue);
      }
    };
    const beenSet = currentValue !== consoleURL;

    return (
      <Modal
        data-test-id="edit-console-url-dialog"
        title={consoleURL ? 'Edit console URL' : 'Add console URL'}
        secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
        onClose={cancelEdit}
        primaryText={consoleURL ? 'Save' : 'Add URL'}
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={!!validationMessage || !beenSet}
      >
        <>
          {hasError}
          {!consoleURL && (
            <p>
              Adding a cluster&apos;s web console URL will allow you to&nbsp; launch the web console
              from the OpenShift Cluster Manager.
            </p>
          )}
          <Form
            onSubmit={(e) => {
              handleSubmit();
              e.preventDefault();
            }}
          >
            <FormGroup
              label="Web console URL"
              helperTextInvalid={validationMessage}
              validated={(beenSet ? !validationMessage : true) ? 'default' : 'error'}
              fieldId="edit-console-url-input"
            >
              <TextInput
                type="text"
                validated={(beenSet ? !validationMessage : true) ? 'default' : 'error'}
                value={currentValue}
                placeholder="https://console-openshift-console.apps.mycluster.example.com/"
                onChange={(newValue) => this.setValue(newValue)}
                aria-label="Web console URL"
                id="edit-console-url-input"
              />
            </FormGroup>
          </Form>
        </>
      </Modal>
    );
  }
}

EditConsoleURLDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  consoleURL: PropTypes.string,
  clusterID: PropTypes.string,
  subscriptionID: PropTypes.string,
  shouldDisplayClusterName: PropTypes.bool,
  clusterDisplayName: PropTypes.string,
};

EditConsoleURLDialog.defaultProps = {
  editClusterResponse: {},
};

EditConsoleURLDialog.modalName = modals.EDIT_CONSOLE_URL;

export default EditConsoleURLDialog;
