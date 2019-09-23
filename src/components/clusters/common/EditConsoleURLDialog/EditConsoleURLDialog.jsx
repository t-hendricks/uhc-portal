import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput, FormGroup } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import { checkClusterConsoleURL } from '../../../../common/validators';


class EditConsoleURLDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beenSet: false,
      validFor: null,
      currentValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { validFor } = this.state;
    if (nextProps.clusterID !== validFor) {
      this.setState((state, props) => ({
        validFor: nextProps.clusterID,
        currentValue: props.consoleURL,
        beenSet: false,
      }));
    }
  }


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

  setValue(newValue) {
    this.setState({
      currentValue: newValue,
    });
    if (!this.beenSet) {
      this.setState({ beenSet: true });
    }
  }

  render() {
    const {
      isOpen, closeModal, submit, editClusterResponse, resetResponse, clusterID, consoleURL,
    } = this.props;
    const { currentValue, beenSet } = this.state;

    const cancelEdit = () => {
      this.setState({ currentValue: null, beenSet: false });
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox message="Error changing console URL" response={editClusterResponse} />
    );

    const validationMessage = checkClusterConsoleURL(currentValue);
    const handleSubmit = () => {
      if (!validationMessage) {
        submit(clusterID, currentValue);
      }
    };

    return isOpen && (

      <Modal
        title={consoleURL ? 'Edit Console URL' : 'Add Console URL'}
        onClose={cancelEdit}
        primaryText={consoleURL ? 'Save' : 'Add URL'}
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={!!validationMessage}
      >
        <React.Fragment>
          {hasError}
          {!consoleURL && (
            <p>
              Adding a cluster&apos;s web console URL will allow you to&nbsp;
              launch the web console from the OpenShift Cluster Manager
            </p>
          )}
          <Form onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
            <FormGroup
              label="Web console URL"
              helperTextInvalid={validationMessage}
              isValid={beenSet ? !validationMessage : true}
              fieldId="edit-console-url-input"
            >
              <TextInput
                type="text"
                isValid={beenSet ? !validationMessage : true}
                value={currentValue}
                placeholder="https://console-openshift-console.apps.mycluster.example.com/"
                onChange={newValue => this.setValue(newValue)}
                aria-label="Web console URL"
                id="edit-console-url-input"
              />
            </FormGroup>
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}

EditConsoleURLDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  consoleURL: PropTypes.string,
  clusterID: PropTypes.string,
};

EditConsoleURLDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditConsoleURLDialog;
